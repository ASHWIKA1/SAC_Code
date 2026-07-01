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
    
    # Test relationship and data access
    php_code = r"""
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\SmVaccinationRecord;

try {
    $count = SmVaccinationRecord::count();
    echo "Total Records: " . $count . "\n";
    
    $records = SmVaccinationRecord::with('student')->take(5)->get();
    foreach($records as $r) {
        $name = $r->student ? ($r->student->first_name . ' ' . $r->student->last_name) : 'No Student';
        echo "Record ID: {$r->id} | Student: {$name} | Vaccine: {$r->vaccine_name}\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
"""
    command = f"cd {remote_dir} && php -r \"{php_code}\""
    
    stdin, stdout, stderr = ssh.exec_command(command)
    print("--- Production Data Check ---")
    print(stdout.read().decode('utf-8'))
    print("--- Error ---")
    print(stderr.read().decode('utf-8'))

finally:
    ssh.close()
