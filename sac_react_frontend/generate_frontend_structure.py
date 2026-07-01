import os
import re
import sys
import argparse

sql_filepath = r"c:\Users\ashwi\Downloads\SAC_Php\sac_spring_boot\src\main\resources\db\migration\V8__custom_modules_schema.sql"
react_output_file = r"c:\Users\ashwi\Downloads\SAC_Php\sac_react_frontend\src\pages\modules\AllModules.jsx"

def snake_to_camel(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def snake_to_title(snake_str):
    return ' '.join(x.title() for x in snake_str.split('_'))

def parse_sql_columns(filepath, target_table):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    pattern = re.compile(r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`([^`]+)`\s*\((.*?)\n\)\s*(?:ENGINE|DEFAULT CHARSET|COLLATE|AUTO_INCREMENT|;)', re.DOTALL | re.IGNORECASE)
    
    for match in pattern.finditer(content):
        table_name = match.group(1)
        if table_name == target_table:
            columns_text = match.group(2)
            columns = []
            for line in columns_text.split('\n'):
                line = line.strip()
                col_match = re.match(r'^`([^`]+)`\s+([a-zA-Z0-9_]+)(?:\(([^)]+)\))?', line)
                if col_match:
                    col_name = col_match.group(1)
                    db_type = col_match.group(2).lower()
                    columns.append((col_name, db_type))
            return columns
    return None

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

def generate_react_page(table_name, columns, module, class_name):
    rest_path = class_name.lower()
    api_path = f"/api/v1/{module}/{rest_path}"
    
    page_name = f"{class_name}Page"
    title = snake_to_title(table_name)
    if title.startswith("Sm "):
        title = title[3:]
    elif title.startswith("Front "):
        title = title[6:]
        
    react_cols = []
    react_fields = []
    
    for col_name, db_type in columns:
        if col_name in ['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'school_id']:
            continue
            
        camel_key = snake_to_camel(col_name)
        title_label = snake_to_title(col_name)
        if title_label.endswith(" Id"):
            title_label = title_label[:-3]
            
        if col_name == 'active_status':
            react_cols.append(f"      {{ label: 'Status', render: r => <Badge type={{r.activeStatus === 1 ? 'success' : 'danger'}}>{{r.activeStatus === 1 ? 'Active' : 'Inactive'}}</Badge> }}")
            react_fields.append(f"      {{ key: 'activeStatus', label: 'Status', type: 'select', options: [{{ value: 1, label: 'Active' }}, {{ value: 0, label: 'Inactive' }}] }}")
        else:
            if 'int' in db_type or any(x in db_type for x in ['double', 'float', 'decimal']):
                f_type = "type: 'number', "
            elif 'date' in db_type:
                f_type = "type: 'date', "
            else:
                f_type = ""
                
            react_cols.append(f"      {{ label: '{title_label}', key: '{camel_key}' }}")
            react_fields.append(f"      {{ key: '{camel_key}', label: '{title_label}', {f_type}placeholder: 'Enter {title_label.lower()}' }}")
            
    cols_str = ',\n'.join(react_cols)
    fields_str = ',\n'.join(react_fields)
    
    code = f"""
// Generated from table {table_name}
export function {page_name}() {{
  return <GenericCrudPage
    title="{title}"
    breadcrumbs={{[{{ label: '{module.capitalize()}' }}, {{ label: '{title}' }}]}}
    apiPath="{api_path}"
    addLabel="Add {title}"
    columns={{[
{cols_str}
    ]}}
    formFields={{[
{fields_str}
    ]}}
    mockData={{[]}}
  />;
}}
"""
    return code

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate React views from SQL migrations.")
    parser.add_argument("--sql", default=sql_filepath, help="Path to SQL file")
    parser.add_argument("--table", required=True, help="Database table name")
    parser.add_argument("--module", help="Override module folder name")
    parser.add_argument("--class-name", help="Override class name")
    parser.add_argument("--output", default=react_output_file, help="React output file path to append page code")
    
    args = parser.parse_args()
    
    sql_file = os.path.abspath(args.sql)
    if not os.path.exists(sql_file):
        print(f"Error: SQL file not found at {sql_file}")
        sys.exit(1)
        
    columns = parse_sql_columns(sql_file, args.table)
    if not columns:
        print(f"Error: Table '{args.table}' not found in {sql_file}")
        sys.exit(1)
        
    module = args.module
    class_name = args.class_name
    if not module or not class_name:
        inf_module, inf_class = infer_module_and_class(args.table)
        module = module or inf_module
        class_name = class_name or inf_class
        
    page_code = generate_react_page(args.table, columns, module, class_name)
    
    if os.path.exists(args.output):
        with open(args.output, 'a', encoding='utf-8') as f:
            f.write("\n" + page_code)
        print(f"React page '{class_name}Page' appended to {args.output} successfully!")
        print(f"Import syntax for App.jsx:\nimport {{ {class_name}Page }} from './pages/modules/AllModules';")
        print(f"Route syntax for App.jsx:\n<Route path=\"/admin/{class_name.lower()}\" element={{<{class_name}Page />}} />")
    else:
        print(f"Error: Output file {args.output} does not exist.")
        sys.exit(1)
