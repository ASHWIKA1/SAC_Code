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
    sftp = ssh.open_sftp()
    sftp.put('fix_sidebar2.php', remote_dir + 'fix_sidebar2.php')
    sftp.close()

    stdin, stdout, stderr = ssh.exec_command(f"cd {remote_dir} && php fix_sidebar2.php")
    print(stdout.read().decode('utf-8', errors='replace'))
    err = stderr.read().decode('utf-8', errors='replace')
    if err: print("ERR:", err)

finally:
    ssh.close()
