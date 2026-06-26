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
    
    # Check the last 100 lines of laravel.log
    stdin, stdout, stderr = ssh.exec_command(f"tail -n 100 {remote_dir}storage/logs/laravel.log")
    print("--- Laravel Log ---")
    print(stdout.read().decode('utf-8'))
    print("--- End Log ---")

finally:
    ssh.close()
