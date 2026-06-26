"""
Fix SAC test deployment:
1. Upload corrected application.properties (correct DB: u856184323_SAC)
2. Set up proper .htaccess + index.php in testing_of_sac directory
3. Restart Spring Boot with correct config
"""
import paramiko
import time
import os

HOST = '82.25.120.218'
PORT = 65002
USERNAME = 'u856184323'
PASSWORD = 'Eash@2005'

JAVA_BIN = '/home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/jdk-21.0.2+13-jre/bin/java'
REMOTE_JAR = '/home/u856184323/sac_springboot/erp.jar'
REMOTE_CONFIG = '/home/u856184323/sac_springboot/config/application.properties'
REMOTE_LOGS = '/home/u856184323/sac_springboot/logs'
TESTING_DIR = '/home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac'
REACT_DIST = r'c:\Users\ashwi\Downloads\SAC_Php\sac_react_frontend\dist'
LOCAL_CONFIG = r'c:\Users\ashwi\Downloads\SAC_Php\sac_spring_boot\deploy\application-sac-test.properties'

# .htaccess for testing_of_sac - routes requests to index.php if they don't match static files
HTACCESS_CONTENT = """RewriteEngine On
RewriteBase /testing_of_sac/

# Serve existing files and directories directly
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Otherwise route everything to index.php
RewriteRule ^(.*)$ index.php [L]
"""

# index.php acting as API proxy and SPA fallback router
INDEX_PHP = """<?php
$backend_url = 'http://127.0.0.1:8085';

$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Strip prefixes for route detection
$path = preg_replace('#^/testing_of_sac#', '', $path);
$path = preg_replace('#^/index.php#', '', $path);

$is_api = (strpos($path, '/api/') === 0 || strpos($path, '/actuator/') === 0);

if ($is_api) {
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Clean uri for the backend
    $clean_uri = preg_replace('#^/testing_of_sac#', '', $uri);
    $clean_uri = preg_replace('#^/index.php#', '', $clean_uri);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $backend_url . $clean_uri);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);

    if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
        $body = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }

    $headers = [];
    foreach (getallheaders() as $name => $value) {
        if (strcasecmp($name, 'Host') !== 0) {
            $headers[] = "$name: $value";
        }
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    if ($response === false) {
        header("HTTP/1.1 502 Bad Gateway");
        echo "Spring Boot backend not available. Error: " . curl_error($ch);
        exit;
    }

    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $resp_headers = substr($response, 0, $header_size);
    $resp_body = substr($response, $header_size);
    curl_close($ch);

    foreach (explode("\\r\\n", $resp_headers) as $hdr) {
        if (!empty($hdr) && stripos($hdr, 'Transfer-Encoding:') === false) {
            header($hdr);
        }
    }

    echo $resp_body;
} else {
    // Serve the React SPA index.html
    header("Content-Type: text/html; charset=utf-8");
    readfile(__DIR__ . '/index.html');
}
"""

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)
sftp = ssh.open_sftp()

def run(cmd, label=None):
    if label: print(f"\n[{label}]")
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=60)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print(f"[ERR] {err}")
    return out

try:
    print("=" * 60)
    print("  Fixing SAC Test Deployment")
    print("=" * 60)

    # 1. Upload correct application.properties
    print("\n[1/5] Uploading corrected application.properties (correct DB credentials)...")
    sftp.put(LOCAL_CONFIG, REMOTE_CONFIG)
    print("  [OK] Uploaded application.properties with u856184323_SAC database")

    # 2. Upload correct .htaccess to testing_of_sac
    print("\n[2/5] Updating .htaccess in testing_of_sac...")
    with sftp.open(f"{TESTING_DIR}/.htaccess", 'w') as f:
        f.write(HTACCESS_CONTENT)
    print("  [OK] .htaccess updated to proxy /api/* -> port 8085")

    # 3. Upload index.php
    print("\n[3/5] Updating index.php proxy in testing_of_sac...")
    with sftp.open(f"{TESTING_DIR}/index.php", 'w') as f:
        f.write(INDEX_PHP)
    print("  [OK] index.php updated")

    # 4. Upload React frontend to testing_of_sac
    print("\n[4/5] Uploading React frontend...")
    def upload_dir(local_dir, remote_dir):
        for item in os.listdir(local_dir):
            local_item = os.path.join(local_dir, item)
            remote_item = f"{remote_dir}/{item}"
            if os.path.isdir(local_item):
                try: sftp.mkdir(remote_item)
                except: pass
                upload_dir(local_item, remote_item)
            else:
                sftp.put(local_item, remote_item)
    upload_dir(REACT_DIST, TESTING_DIR)
    print("  [OK] React frontend uploaded to testing_of_sac/")

    # 5. Stop old instance and restart with correct config
    print("\n[5/5] Restarting Spring Boot with correct database config...")
    run("pkill -f 'erp.jar' 2>/dev/null || true", "Stop existing process")
    time.sleep(3)

    start_cmd = (
        f"nohup {JAVA_BIN} "
        f"-Xms64m -Xmx256m -Xss256k "
        f"-XX:ActiveProcessorCount=1 -XX:ParallelGCThreads=1 "
        f"-XX:CICompilerCount=2 -XX:TieredStopAtLevel=1 "
        f"-jar {REMOTE_JAR} "
        f"--spring.config.location=file:{REMOTE_CONFIG} "
        f"--server.port=8085 "
        f"> {REMOTE_LOGS}/app.log 2>&1 &"
    )
    run(start_cmd, "Start Spring Boot with correct DB")

    print("\n  Waiting 35 seconds for Spring Boot startup...")
    time.sleep(35)

    # Check process
    proc = run("ps aux | grep erp.jar | grep -v grep | awk '{print $2,$3}'", "Process check")
    if proc:
        print(f"  [OK] Spring Boot running! PID/CPU: {proc}")
    else:
        print("  [WARN] Process not found!")

    # Health check
    health = run("curl -s http://127.0.0.1:8085/actuator/health 2>/dev/null || echo 'curl failed'", "Health check")

    # Key log lines
    run(f"grep -i 'started\\|error\\|exception\\|hikari\\|connected\\|access denied' {REMOTE_LOGS}/app.log | tail -15", "Key log messages")

    print("\n" + "=" * 60)
    print("  DEPLOYMENT SUMMARY")
    print("=" * 60)
    print(f"\n  URL: https://goteksuite.com/sac-test/testing_of_sac/")
    print(f"  API: https://goteksuite.com/sac-test/testing_of_sac/api/")
    print(f"  DB:  u856184323_SAC (user: u856184323_SAC_GOTEK)")
    print(f"  JAR: {REMOTE_JAR}")
    print(f"  Logs: {REMOTE_LOGS}/app.log")
    print(f"\n  tail logs: ssh -p {PORT} {USERNAME}@{HOST} 'tail -f {REMOTE_LOGS}/app.log'")

finally:
    sftp.close()
    ssh.close()
    print("\n  SSH connection closed.")
