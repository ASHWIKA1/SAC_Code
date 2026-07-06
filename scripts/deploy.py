import paramiko
import os

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'
remote_dir = 'domains/test-technoprint.online/public_html/erpv2/'
local_zip = r'c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\extension_modules_update.zip'

if not os.path.exists(local_zip):
    print("Error: Zip file not found locally!")
    exit(1)

print("Connecting to SSH...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    
    print("Uploading zip file...")
    sftp = ssh.open_sftp()
    remote_path = f"{remote_dir}extension_modules_update.zip"
    sftp.put(local_zip, remote_path)
    sftp.close()
    
    print("Upload complete. Executing deployment commands...")
    
    # 1. Unzip the update forcefully, overwriting existing files
    # 2. Run migrations
    # 3. Clear cache
    commands = [
        f"cd {remote_dir} && unzip -o extension_modules_update.zip",
        f"cd {remote_dir} && php artisan optimize:clear",
        f"cd {remote_dir} && php artisan migrate --path=database/migrations/2026_04_14_000001_create_school_extension_custom_tables.php --force"
    ]
    
    for cmd in commands:
        print(f"Running: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status() 
        print("Output:\n", stdout.read().decode())
        if exit_status != 0:
            print("Error:\n", stderr.read().decode())
    
    print("Deployment completed successfully!")
finally:
    ssh.close()
