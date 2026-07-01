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
    
    # Try to find custom menu related entries in the database
    # We'll use a PHP script to dump the tables that contain 'menu' or 'sidebar' or 'permission'
    php_code = r"""
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$tables = DB::select('SHOW TABLES');
foreach($tables as $t) {
    $tableName = array_values((array)$t)[0];
    if (strpos($tableName, 'menu') !== false || strpos($tableName, 'sidebar') !== false || strpos($tableName, 'permission') !== false || strpos($tableName, 'module') !== false) {
        echo $tableName . PHP_EOL;
    }
}
"""
    command = f"cd {remote_dir} && php -r \"{php_code}\""
    
    stdin, stdout, stderr = ssh.exec_command(command)
    print("--- Relevant Database Tables ---")
    output = stdout.read().decode('utf-8')
    print(output)
    print("--- Error ---")
    print(stderr.read().decode('utf-8'))

finally:
    ssh.close()
