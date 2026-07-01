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
    
    # Direct database check using PDO (bypass Laravel ORM issues if any)
    php_code = r"""
$env = parse_ini_file('.env');
$dsn = "mysql:host=" . $env['DB_HOST'] . ";dbname=" . $env['DB_DATABASE'] . ";charset=utf8mb4";
$pdo = new PDO($dsn, $env['DB_USERNAME'], $env['DB_PASSWORD']);

$stmt = $pdo->query("SELECT slug, menu_type, url_link FROM custom_menus WHERE slug LIKE '%vaccination%'");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "Slug: {$row['slug']} | Type: {$row['menu_type']} | Link: {$row['url_link']}\n";
}

$stmt = $pdo->query("SELECT id, name, route FROM permissions WHERE route LIKE '%vaccination%'");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "Permission: {$row['name']} | Route: {$row['route']}\n";
}
"""
    # Note: We need to handle the .env path correctly. usually it's in the remote_dir.
    command = f"cd {remote_dir} && php -r \"{php_code}\""
    
    stdin, stdout, stderr = ssh.exec_command(command)
    print("--- Database Raw Check ---")
    print(stdout.read().decode('utf-8'))
    print("--- Error ---")
    print(stderr.read().decode('utf-8'))

finally:
    ssh.close()
