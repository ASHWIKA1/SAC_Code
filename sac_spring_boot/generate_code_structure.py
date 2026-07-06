import re
import os
import sys
import argparse

sql_filepath = r"c:\Users\ashwi\Downloads\SAC_Php\sac_spring_boot\src\main\resources\db\migration\V8__custom_modules_schema.sql"
java_base_dir = r"c:\Users\ashwi\Downloads\SAC_Php\sac_spring_boot\src\main\java\com\sac\erp\modules"

singular_map = {
    'front_class_routines': 'FrontClassRoutine',
    'front_exam_routines': 'FrontExamRoutine',
    'sm_canteen_wallets': 'CanteenWallet'
}

module_map = {
    'front_class_routines': 'timetable',
    'front_exam_routines': 'exam',
    'sm_canteen_wallets': 'canteen'
}

def snake_to_camel(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def infer_module_and_class(table_name):
    clean_name = table_name
    if clean_name.startswith('sm_'):
        clean_name = clean_name[3:]
    elif clean_name.startswith('front_'):
        clean_name = clean_name[6:]
        
    parts = clean_name.split('_')
    
    def singularize(word):
        if word.endswith('ies'):
            return word[:-3] + 'y'
        elif word.endswith('es') and not word.endswith('ees'):
            return word[:-2]
        elif word.endswith('s') and not word.endswith('ss'):
            return word[:-1]
        return word
        
    first_part = parts[0]
    if first_part in ['canteen', 'chat', 'jitsi', 'timetable', 'behaviour', 'leave', 'payroll']:
        if first_part == 'behaviour':
            module = 'behavior'
        else:
            module = first_part
        remaining_parts = parts[1:]
    else:
        module = first_part
        remaining_parts = parts[1:] if len(parts) > 1 else parts
        
    if first_part == 'behaviour':
        singular_parts = ['Behavior'] + [singularize(p).capitalize() for p in remaining_parts]
    elif first_part in ['canteen', 'chat', 'jitsi', 'timetable']:
        singular_parts = [first_part.capitalize()] + [singularize(p).capitalize() for p in remaining_parts]
    else:
        singular_parts = [singularize(p).capitalize() for p in parts]
        
    class_name = ''.join(singular_parts)
    return module, class_name

def clean_type(db_type):
    db_type = db_type.lower()
    if 'int' in db_type:
        return 'int'
    elif any(x in db_type for x in ['char', 'text', 'varchar', 'longtext', 'enum']):
        return 'varchar'
    elif 'date' in db_type:
        return 'date'
    elif 'timestamp' in db_type or 'datetime' in db_type:
        return 'datetime'
    elif any(x in db_type for x in ['double', 'float', 'decimal']):
        return 'double'
    return 'varchar'

def parse_sql(filepath, target_table=None, all_tables=False):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    tables = {}
    pattern = re.compile(r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`([^`]+)`\s*\((.*?)\n\)\s*(?:ENGINE|DEFAULT CHARSET|COLLATE|AUTO_INCREMENT|;)', re.DOTALL | re.IGNORECASE)
    
    for match in pattern.finditer(content):
        table_name = match.group(1)
        if not all_tables and target_table is not None and table_name != target_table:
            continue
        if not all_tables and target_table is None and table_name not in singular_map:
            continue
            
        columns_text = match.group(2)
        columns = []
        for line in columns_text.split('\n'):
            line = line.strip()
            col_match = re.match(r'^`([^`]+)`\s+([a-zA-Z0-9_]+)(?:\(([^)]+)\))?', line)
            if col_match:
                col_name = col_match.group(1)
                db_type = col_match.group(2)
                columns.append((col_name, db_type))
        tables[table_name] = columns
        
    return tables

def generate_java_files(tables, override_module=None, override_class=None):
    for table_name, columns in tables.items():
        module = override_module if override_module else module_map.get(table_name)
        if not module:
            module, _ = infer_module_and_class(table_name)
            
        class_name = override_class if override_class else singular_map.get(table_name)
        if not class_name:
            _, class_name = infer_module_and_class(table_name)
        
        # Prepare folders
        entity_dir = os.path.join(java_base_dir, module, "entity")
        repo_dir = os.path.join(java_base_dir, module, "repository")
        service_dir = os.path.join(java_base_dir, module, "service")
        controller_dir = os.path.join(java_base_dir, module, "controller")
        
        for d in [entity_dir, repo_dir, service_dir, controller_dir]:
            os.makedirs(d, exist_ok=True)
            
        # Parse fields
        fields = []
        has_local_date = False
        has_local_date_time = False
        has_active_status = False
        
        for col_name, db_type in columns:
            if col_name in ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']:
                continue
            if col_name == 'active_status':
                has_active_status = True
                
            java_field = snake_to_camel(col_name)
            if java_field == 'class':
                java_field = 'classField'
            elif java_field in ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while']:
                java_field += 'Val'
            t_type = clean_type(db_type)
            
            if col_name == 'school_id':
                java_type = 'String'
            elif col_name.endswith('_id'):
                java_type = 'Long'
            elif t_type == 'int':
                java_type = 'Integer'
            elif t_type == 'double':
                java_type = 'Double'
            elif t_type == 'date':
                java_type = 'LocalDate'
                has_local_date = True
            elif t_type == 'datetime':
                java_type = 'LocalDateTime'
                has_local_date_time = True
            else:
                java_type = 'String'
                
            fields.append((col_name, java_field, java_type))
            
        # --- 1. Entity ---
        entity_content = f"package com.sac.erp.modules.{module}.entity;\n\n"
        entity_content += "import com.sac.erp.entity.BaseEntity;\n"
        entity_content += "import jakarta.persistence.*;\n"
        entity_content += "import lombok.Getter;\n"
        entity_content += "import lombok.Setter;\n"
        if has_local_date:
            entity_content += "import java.time.LocalDate;\n"
        if has_local_date_time:
            entity_content += "import java.time.LocalDateTime;\n"
            
        entity_content += "\n@Getter\n@Setter\n@Entity\n"
        entity_content += f'@Table(name = "{table_name}")\n'
        entity_content += f"public class {class_name} extends BaseEntity {{\n\n"
        entity_content += "    @Id\n"
        entity_content += "    @GeneratedValue(strategy = GenerationType.IDENTITY)\n"
        entity_content += "    private Long id;\n"
        
        for col_name, java_field, java_type in fields:
            entity_content += f"\n    @Column(name = \"{col_name}\")\n"
            entity_content += f"    private {java_type} {java_field};\n"
            
        entity_content += "}\n"
        
        with open(os.path.join(entity_dir, f"{class_name}.java"), "w", encoding="utf-8") as f:
            f.write(entity_content)
            
        # --- 2. Repository ---
        repo_content = f"package com.sac.erp.modules.{module}.repository;\n\n"
        repo_content += f"import com.sac.erp.modules.{module}.entity.{class_name};\n"
        repo_content += "import org.springframework.data.jpa.repository.JpaRepository;\n"
        repo_content += "import org.springframework.stereotype.Repository;\n"
        if has_active_status:
            repo_content += "import java.util.List;\n"
            
        repo_content += "\n@Repository\n"
        repo_content += f"public interface {class_name}Repository extends JpaRepository<{class_name}, Long> {{\n"
        if has_active_status:
            repo_content += f"    List<{class_name}> findByActiveStatus(Integer activeStatus);\n"
        repo_content += "}\n"
        
        with open(os.path.join(repo_dir, f"{class_name}Repository.java"), "w", encoding="utf-8") as f:
            f.write(repo_content)
            
        # --- 3. Service Interface ---
        service_content = f"package com.sac.erp.modules.{module}.service;\n\n"
        service_content += f"import com.sac.erp.modules.{module}.entity.{class_name};\n"
        service_content += "import java.util.List;\n\n"
        service_content += f"public interface {class_name}Service {{\n"
        service_content += f"    List<{class_name}> getAll();\n"
        service_content += f"    {class_name} getById(Long id);\n"
        service_content += f"    {class_name} create({class_name} entity);\n"
        service_content += f"    {class_name} update(Long id, {class_name} entity);\n"
        service_content += "    void delete(Long id);\n"
        service_content += "}\n"
        
        with open(os.path.join(service_dir, f"{class_name}Service.java"), "w", encoding="utf-8") as f:
            f.write(service_content)
            
        # --- 4. Service Implementation ---
        impl_content = f"package com.sac.erp.modules.{module}.service;\n\n"
        impl_content += f"import com.sac.erp.modules.{module}.entity.{class_name};\n"
        impl_content += f"import com.sac.erp.modules.{module}.repository.{class_name}Repository;\n"
        impl_content += "import lombok.RequiredArgsConstructor;\n"
        impl_content += "import org.springframework.stereotype.Service;\n"
        impl_content += "import org.springframework.transaction.annotation.Transactional;\n"
        impl_content += "import java.util.List;\n\n"
        impl_content += "@Service\n"
        impl_content += "@RequiredArgsConstructor\n"
        impl_content += f"public class {class_name}ServiceImpl implements {class_name}Service {{\n\n"
        impl_content += f"    private final {class_name}Repository repository;\n\n"
        impl_content += "    @Override\n"
        impl_content += "    @Transactional(readOnly = true)\n"
        impl_content += f"    public List<{class_name}> getAll() {{\n"
        if has_active_status:
            impl_content += "        return repository.findByActiveStatus(1);\n"
        else:
            impl_content += "        return repository.findAll();\n"
        impl_content += "    }\n\n"
        
        impl_content += "    @Override\n"
        impl_content += "    @Transactional(readOnly = true)\n"
        impl_content += f"    public {class_name} getById(Long id) {{\n"
        impl_content += f"        return repository.findById(id)\n"
        impl_content += f'                .orElseThrow(() -> new RuntimeException("{class_name} not found with id: " + id));\n'
        impl_content += "    }\n\n"
        
        impl_content += "    @Override\n"
        impl_content += "    @Transactional\n"
        impl_content += f"    public {class_name} create({class_name} entity) {{\n"
        impl_content += "        return repository.save(entity);\n"
        impl_content += "    }\n\n"
        
        impl_content += "    @Override\n"
        impl_content += "    @Transactional\n"
        impl_content += f"    public {class_name} update(Long id, {class_name} entity) {{\n"
        impl_content += "        getById(id);\n"
        impl_content += "        entity.setId(id);\n"
        impl_content += "        return repository.save(entity);\n"
        impl_content += "    }\n\n"
        
        impl_content += "    @Override\n"
        impl_content += "    @Transactional\n"
        impl_content += "    public void delete(Long id) {\n"
        if has_active_status:
            impl_content += f"        {class_name} existing = getById(id);\n"
            impl_content += "        existing.setActiveStatus(0);\n"
            impl_content += "        repository.save(existing);\n"
        else:
            impl_content += "        repository.deleteById(id);\n"
        impl_content += "    }\n"
        impl_content += "}\n"
        
        with open(os.path.join(service_dir, f"{class_name}ServiceImpl.java"), "w", encoding="utf-8") as f:
            f.write(impl_content)
            
        # --- 5. Controller ---
        rest_path = class_name.lower()
        
        ctrl_content = f"package com.sac.erp.modules.{module}.controller;\n\n"
        ctrl_content += f"import com.sac.erp.modules.{module}.entity.{class_name};\n"
        ctrl_content += f"import com.sac.erp.modules.{module}.service.{class_name}Service;\n"
        ctrl_content += "import lombok.RequiredArgsConstructor;\n"
        ctrl_content += "import lombok.extern.slf4j.Slf4j;\n"
        ctrl_content += "import org.springframework.http.ResponseEntity;\n"
        ctrl_content += "import org.springframework.web.bind.annotation.*;\n"
        ctrl_content += "import java.util.List;\n\n"
        ctrl_content += "@Slf4j\n"
        ctrl_content += "@RestController\n"
        ctrl_content += f'@RequestMapping("/api/v1/{module}/{rest_path}")\n'
        ctrl_content += "@RequiredArgsConstructor\n"
        ctrl_content += f"public class {class_name}Controller {{\n\n"
        ctrl_content += f"    private final {class_name}Service service;\n\n"
        
        ctrl_content += "    @GetMapping\n"
        ctrl_content += f"    public ResponseEntity<List<{class_name}>> getAll() {{\n"
        ctrl_content += f'        log.info("REST request to get all {class_name}s");\n'
        ctrl_content += "        return ResponseEntity.ok(service.getAll());\n"
        ctrl_content += "    }\n\n"
        
        ctrl_content += "    @GetMapping(\"/{id}\")\n"
        ctrl_content += f"    public ResponseEntity<{class_name}> getById(@PathVariable Long id) {{\n"
        ctrl_content += f'        log.info("REST request to get {class_name} : {{}}", id);\n'
        ctrl_content += "        return ResponseEntity.ok(service.getById(id));\n"
        ctrl_content += "    }\n\n"
        
        ctrl_content += "    @PostMapping\n"
        ctrl_content += f"    public ResponseEntity<{class_name}> create(@RequestBody {class_name} entity) {{\n"
        ctrl_content += f'        log.info("REST request to create {class_name}");\n'
        ctrl_content += "        return ResponseEntity.ok(service.create(entity));\n"
        ctrl_content += "    }\n\n"
        
        ctrl_content += "    @PutMapping(\"/{id}\")\n"
        ctrl_content += f"    public ResponseEntity<{class_name}> update(@PathVariable Long id, @RequestBody {class_name} entity) {{\n"
        ctrl_content += f'        log.info("REST request to update {class_name} : {{}}", id);\n'
        ctrl_content += "        return ResponseEntity.ok(service.update(id, entity));\n"
        ctrl_content += "    }\n\n"
        
        ctrl_content += "    @DeleteMapping(\"/{id}\")\n"
        ctrl_content += "    public ResponseEntity<Void> delete(@PathVariable Long id) {\n"
        ctrl_content += f'        log.info("REST request to delete {class_name} : {{}}", id);\n'
        ctrl_content += "        service.delete(id);\n"
        ctrl_content += "        return ResponseEntity.noContent().build();\n"
        ctrl_content += "    }\n"
        ctrl_content += "}\n"
        
        with open(os.path.join(controller_dir, f"{class_name}Controller.java"), "w", encoding="utf-8") as f:
            f.write(ctrl_content)
            
    print("All Java files generated successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Spring Boot code from SQL migrations.")
    parser.add_argument("--sql", default=sql_filepath, help="Path to SQL file")
    parser.add_argument("--table", help="Specific table name to generate code for")
    parser.add_argument("--module", help="Override module name")
    parser.add_argument("--class-name", help="Override class name")
    parser.add_argument("--all", action="store_true", help="Generate all tables found in the SQL file")
    
    args = parser.parse_args()
    
    sql_file = os.path.abspath(args.sql)
    if not os.path.exists(sql_file):
        print(f"Error: SQL file not found at {sql_file}")
        sys.exit(1)
        
    tables = parse_sql(sql_file, target_table=args.table, all_tables=args.all)
    if not tables:
        if args.table:
            print(f"Error: Table '{args.table}' not found in {sql_file}")
        else:
            print(f"No tables resolved for generation in {sql_file}")
        sys.exit(1)
        
    print(f"Parsed {len(tables)} target tables from SQL file.")
    generate_java_files(tables, override_module=args.module, override_class=args.class_name)
