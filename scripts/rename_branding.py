# -*- coding: utf-8 -*-
import os
import re

root_dir = r"c:\Users\ashwi\Downloads\SAC_Php"
exclude_dirs = {".git", "node_modules", "vendor", "target", "backups", "venv", ".idea"}

replacements = [
    # 1. JWT secret key specifically
    ("sac_developed_by_tis_java_spring_boot_migration_secret_key_jwt_2026_enterprise_grade", "sac_developed_by_tis_java_spring_boot_migration_secret_key_jwt_2026_enterprise_grade"),
    
    # 2. Mixed-case company support email & domain
    ("support@tis.com", "support@tis.com"),
    ("tis.com/contact", "tis.com/contact"),
    ("tis.com", "tis.com"),
    ("TIS", "TIS"),
    ("TIS", "TIS"),
    ("TIS", "TIS"),
    ("TIS", "TIS"),
    
    # 3. Mixed-case brand names
    ("SAC developed by TIS", "SAC developed by TIS"),
    ("SAC developed by TIS", "SAC developed by TIS"),
    ("SAC developed by TIS", "SAC developed by TIS"),
    ("SAC developed by TIS", "SAC developed by TIS"),
    ("sac_developed_by_tis", "sac_developed_by_tis"),
    
    # 4. Standard lowercase / uppercase brands
    ("sac developed by TIS", "sac developed by TIS"),
    ("SAC developed by TIS", "SAC developed by TIS"),
    ("SAC", "SAC"),
]

changed_files_count = 0

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Prune excluded directories
    dirnames[:] = [d for d in dirnames if d.lower() not in exclude_dirs]
    
    for filename in filenames:
        # Skip binary files
        if filename.endswith((".jar", ".zip", ".tar.gz", ".png", ".jpg", ".ico", ".gif", ".pdf", ".woff", ".woff2", ".ttf", ".eot")):
            continue
            
        file_path = os.path.join(dirpath, filename)
        
        # Read the file
        try:
            with open(file_path, "rb") as f:
                raw_data = f.read()
        except Exception as e:
            print(f"Error reading raw {file_path}: {e}")
            continue
            
        try:
            content = raw_data.decode("utf-8")
            encoding = "utf-8"
        except UnicodeDecodeError:
            try:
                content = raw_data.decode("latin-1")
                encoding = "latin-1"
            except Exception as e:
                print(f"Skipping binary/unreadable file: {file_path}")
                continue
        
        # Perform replacements
        modified = False
        new_content = content
        
        for search, replace in replacements:
            # We want to replace case-sensitively or case-insensitively depending on specific context, but standard replace covers our patterns
            if search in new_content:
                new_content = new_content.replace(search, replace)
                modified = True
                
            # Fallback for case-insensitive matches if any remain
            # but let's be careful not to corrupt variables/paths
            
        if modified:
            try:
                with open(file_path, "w", encoding=encoding, newline='') as f:
                    f.write(new_content)
                changed_files_count += 1
                rel_path = os.path.relpath(file_path, root_dir)
                print(f"Updated: {rel_path}")
            except Exception as e:
                print(f"Error writing {file_path}: {e}")

print(f"\nCompleted! Total files updated: {changed_files_count}")
