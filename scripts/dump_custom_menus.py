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
$env = parse_ini_file('.env');
$dsn = "mysql:host=" . $env['DB_HOST'] . ";dbname=" . $env['DB_DATABASE'] . ";charset=utf8mb4";
$pdo = new PDO($dsn, $env['DB_USERNAME'], $env['DB_PASSWORD']);

$stmt = $pdo->query("SELECT slug, menu_type, url_link FROM custom_menus");
echo "--- custom_menus table ---\n";
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "Slug: " . $row['slug'] . " | Type: " . $row['menu_type'] . " | Link: " . $row['url_link'] . "\n";
}
"""
    # Use single quotes for the command to avoid $ escaping hell in shell
    command = "cd " + remote_dir + " && php -r '" + php_code + "'"
    
    stdin, stdout, stderr = ssh.exec_command(command)
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))

finally:
    ssh.close()
