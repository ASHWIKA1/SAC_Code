import os
import shutil
import glob
import re

base_dir = r"c:\Users\ashwi\Downloads\SAC_Php\sac_spring_boot\src\main\java\com\sac\erp"
core_module_dir = os.path.join(base_dir, "modules", "core")

# Folders to move
folders = ["entity", "repository", "controller", "dto"]

# 1. Create target directories
for folder in folders:
    os.makedirs(os.path.join(core_module_dir, folder), exist_ok=True)

# 2. Move files and collect old/new import paths
moves = []
for folder in folders:
    src_dir = os.path.join(base_dir, folder)
    if os.path.exists(src_dir):
        for file in os.listdir(src_dir):
            if file.endswith(".java"):
                src_file = os.path.join(src_dir, file)
                dst_file = os.path.join(core_module_dir, folder, file)
                
                # Class name without .java
                class_name = file[:-5]
                
                # Record the old and new import statements for this class
                old_import = f"com.sac.erp.{folder}.{class_name}"
                new_import = f"com.sac.erp.modules.core.{folder}.{class_name}"
                moves.append({
                    "src": src_file,
                    "dst": dst_file,
                    "old_pkg": f"package com.sac.erp.{folder};",
                    "new_pkg": f"package com.sac.erp.modules.core.{folder};",
                    "old_import": old_import,
                    "new_import": new_import
                })

# Actually move files and update their package declarations
for move in moves:
    shutil.move(move["src"], move["dst"])
    # Update package declaration in the moved file
    with open(move["dst"], "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(move["old_pkg"], move["new_pkg"])
    with open(move["dst"], "w", encoding="utf-8") as f:
        f.write(content)

# 3. Update imports across the entire project
java_files = glob.glob(os.path.join(base_dir, "**", "*.java"), recursive=True)

for file in java_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    for move in moves:
        # regex to match whole words (prevent partial matches)
        old_import_pattern = r"\b" + re.escape(move["old_import"]) + r"\b"
        if re.search(old_import_pattern, content):
            content = re.sub(old_import_pattern, move["new_import"], content)
            modified = True
            
    if modified:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)

# 4. Remove old empty directories
for folder in folders:
    src_dir = os.path.join(base_dir, folder)
    if os.path.exists(src_dir) and not os.listdir(src_dir):
        os.rmdir(src_dir)

print(f"Refactoring complete. Moved {len(moves)} files and updated imports.")
