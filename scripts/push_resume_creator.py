import paramiko

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'
remote_dirs = [
    'domains/test1-technosprint.online/public_html/test-sacgotek/',
    'domains/test-technoprint.online/public_html/erpv2/'
]

files = [
    'resources/views/backEnd/studentPanel/resume_creator.blade.php'
]

print("Connecting to SSH...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    sftp = ssh.open_sftp()

    for remote_dir in remote_dirs:
        print(f"\n==============================================")
        print(f" Deploying to: {remote_dir}")
        print(f"==============================================")
        
        for file in files:
            local_path = file
            remote_path = f"{remote_dir}{file}"
            print(f"Uploading {file}...")
            try:
                sftp.put(local_path, remote_path)
            except Exception as e:
                print(f"Warning: Failed to upload to {remote_path}: {e}")
        
        print("Upload complete. Executing deployment commands to clear cache...")
        commands = [
            f"cd {remote_dir} && php artisan view:clear",
            f"cd {remote_dir} && php artisan cache:clear",
            f"cd {remote_dir} && touch public/.htaccess"
        ]
        
        for cmd in commands:
            print(f"Running: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            exit_status = stdout.channel.recv_exit_status() 
            print("Output:\n", stdout.read().decode())
            if exit_status != 0:
                print("Error:\n", stderr.read().decode())
                
    sftp.close()
    print("Multi-site Deployment and Cache Busting completed successfully!")
finally:
    ssh.close()
