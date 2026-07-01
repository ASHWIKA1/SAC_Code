import paramiko

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    
    print("Searching for resume_creator.blade.php on the server...")
    # Search within the entire domains/ directory
    cmd = "find domains/ -name 'resume_creator.blade.php'"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    output = stdout.read().decode().strip()
    errors = stderr.read().decode().strip()
    
    if output:
        print("Found the following locations:")
        print(output)
    else:
        print("File not found.")
        
    if errors:
        print("Errors:", errors)

finally:
    ssh.close()
