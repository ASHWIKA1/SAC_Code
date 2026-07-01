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
    
    php_code = r"""
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
foreach($tables as $t) {
    if (strpos($t, 'menu') !== false || strpos($t, 'permission') !== false || strpos($t, 'sidebar') !== false) {
        echo $t . PHP_EOL;
    }
}
"""
    # Note: getDoctrineSchemaManager() might not be available if doctrine/dbal is not installed.
    # Fallback to SHOW TABLES
    php_code_fallback = r"""
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$tables = DB::select('SHOW TABLES');
foreach($tables as $table) {
    $name = array_values((array)$table)[0];
    if (strpos($name, 'menu') !== false || strpos($name, 'permission') !== false || strpos($name, 'sidebar') !== false) {
        echo $name . PHP_EOL;
    }
}
"""
    # We'll use the fallback as it's more reliable.
    command = "cd " + remote_dir + " && php -r \"" + php_code_fallback + "\""
    
    stdin, stdout, stderr = ssh.exec_command(command)
    print("--- Matching Tables ---")
    print(stdout.read().decode('utf-8'))
    print("--- Error ---")
    print(stderr.read().decode('utf-8'))

finally:
    ssh.close()
