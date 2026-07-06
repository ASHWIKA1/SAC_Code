import paramiko
import sys

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'
remote_dir = 'domains/test-technoprint.online/public_html/erpv2/'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    stdin, stdout, stderr = ssh.exec_command(f'grep -C 3 -i "vaccination" {remote_dir}storage/logs/laravel-2026-04-17.log | tail -n 50')
    out = stdout.read().decode('utf-8', errors='replace')
    print("OUTPUT:")
    print(out)
finally:
    ssh.close()
