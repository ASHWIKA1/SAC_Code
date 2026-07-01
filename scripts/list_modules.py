import paramiko

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'
remote_dir = 'domains/test-technoprint.online/public_html/erpv2/'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    
    stdin, stdout, stderr = ssh.exec_command(f"ls -R {remote_dir}Modules")
    print("--- Modules Directory ---")
    print(stdout.read().decode('utf-8'))

finally:
    ssh.close()
