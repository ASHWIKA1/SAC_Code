import os
import shutil

# Get script directory
base_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.abspath(os.path.join(base_dir, "..", "sac_react_frontend", "dist"))
dest_dir = os.path.abspath(os.path.join(base_dir, "..", "sac_spring_boot", "src", "main", "resources", "static"))

if not os.path.exists(src_dir):
    print(f"Error: Source directory {src_dir} does not exist. Did you run 'npm run build'?")
    exit(1)

print(f"Cleaning destination directory: {dest_dir}...")
if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)
os.makedirs(dest_dir)

# Create testing_of_sac subdirectory
sub_dest_dir = os.path.join(dest_dir, "testing_of_sac")
os.makedirs(sub_dest_dir)

print(f"Copying files from {src_dir} to {dest_dir}...")
# Copy dist files to static root
for item in os.listdir(src_dir):
    s = os.path.join(src_dir, item)
    d = os.path.join(dest_dir, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

# Write redirect index.html at root static directory to resolve React Router basename
redirect_html = """<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/testing_of_sac/" />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to <a href="/testing_of_sac/">/testing_of_sac/</a>...</p>
  </body>
</html>
"""
with open(os.path.join(dest_dir, "index.html"), "w") as f:
    f.write(redirect_html)

print(f"Copying files to {sub_dest_dir}...")
# Copy dist files to static/testing_of_sac
for item in os.listdir(src_dir):
    s = os.path.join(src_dir, item)
    d = os.path.join(sub_dest_dir, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

print("Static files updated successfully!")
