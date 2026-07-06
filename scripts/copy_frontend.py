import os
import shutil

src_dir = r"c:\Users\ashwi\Downloads\SAC_Php\sac_react_frontend\dist"
dest_dir = r"c:\Users\ashwi\Downloads\SAC_Php\sac_spring_boot\src\main\resources\static"

if not os.path.exists(src_dir):
    print(f"Error: Source directory {src_dir} does not exist. Did you run 'npm run build'?")
    exit(1)

print(f"Cleaning destination directory: {dest_dir}...")
if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)
os.makedirs(dest_dir)

print(f"Copying files from {src_dir} to {dest_dir}...")
# Copy dist files to static recursively
for item in os.listdir(src_dir):
    s = os.path.join(src_dir, item)
    d = os.path.join(dest_dir, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

print("Static files updated successfully!")
