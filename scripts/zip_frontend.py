import os
import zipfile

def zip_frontend_project():
    workspace_dir = r"c:\Users\dell\.gemini\antigravity-ide\scratch\sac-code"
    frontend_dir = os.path.join(workspace_dir, "sac_react_frontend")
    zip_name = os.path.join(workspace_dir, "sac_react_frontend.zip")

    # Exclude these paths
    exclude_folders = ["node_modules", "dist", ".vite", "__pycache__"]

    print(f"Creating {zip_name}...")
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(frontend_dir):
            # Exclude folders in-place
            dirs[:] = [d for d in dirs if d not in exclude_folders]
            
            for file in files:
                full_path = os.path.join(root, file)
                # Compute path relative to workspace or frontend directory
                rel_path = os.path.relpath(full_path, workspace_dir)
                
                # Write to zip file
                zf.write(full_path, arcname=rel_path)
                
    print(f"Successfully created zip archive at: {zip_name}")

if __name__ == '__main__':
    zip_frontend_project()
