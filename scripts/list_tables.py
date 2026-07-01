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
    
    php_code = r"require 'vendor/autoload.php'; $app = require_once 'bootstrap/app.php'; $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap(); foreach(DB::select('SHOW TABLES') as $t) { echo array_values((array)$t)[0] . PHP_EOL; }"
    command = f"cd {remote_dir} && php -r \"{php_code}\""
    
    stdin, stdout, stderr = ssh.exec_command(command)
    print("--- Database Tables ---")
    print(stdout.read().decode('utf-8'))
    print("--- Error ---")
    print(stderr.read().decode('utf-8'))

finally:
    ssh.close()
