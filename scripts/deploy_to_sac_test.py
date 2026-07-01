"""
SAC ERP - Deploy Spring Boot to SAC Test Server
SSH: ssh -p 65002 u856184323@82.25.120.218
Deploys: sac_spring_boot/target/erp-1.0.0-SNAPSHOT.jar -> /home/u856184323/sac_springboot/erp.jar
Also uploads config files, frontend dist, and starts the service.
"""

import paramiko
import os
import sys
import stat
import time

# â”€â”€â”€ Connection Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
HOST = '82.25.120.218'
PORT = 65002
USERNAME = 'u856184323'
PASSWORD = 'Eash@2005'

# â”€â”€â”€ Local Paths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
BASE_DIR = r'c:\Users\ashwi\Downloads\SAC_Php'
SPRING_DIR = os.path.join(BASE_DIR, 'sac_spring_boot')
JAR_LOCAL = os.path.join(SPRING_DIR, 'target', 'erp-1.0.0-SNAPSHOT.jar')
DEPLOY_DIR = os.path.join(SPRING_DIR, 'deploy')
REACT_DIST = os.path.join(BASE_DIR, 'sac_react_frontend', 'dist')

# â”€â”€â”€ Remote Paths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
REMOTE_HOME = '/home/u856184323'
REMOTE_SPRINGBOOT = f'{REMOTE_HOME}/sac_springboot'
REMOTE_CONFIG = f'{REMOTE_SPRINGBOOT}/config'
REMOTE_LOGS = f'{REMOTE_SPRINGBOOT}/logs'
REMOTE_JAR = f'{REMOTE_SPRINGBOOT}/erp.jar'

# SAC Test domain web root
REMOTE_WEBROOT = f'{REMOTE_HOME}/domains/sac.test/public_html'
REMOTE_API_DIR = f'{REMOTE_WEBROOT}/api'


def run_remote(ssh, cmd, description=None):
    """Execute a command on the remote server and return (exit_code, stdout, stderr)."""
    if description:
        print(f"\n  â–¶ {description}")
    print(f"    $ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=120)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        print(f"    {out}")
    if err and exit_status != 0:
        print(f"    [ERR] {err}")
    return exit_status, out, err


def sftp_mkdir_p(sftp, remote_path):
    """Create remote directory recursively."""
    parts = remote_path.split('/')
    current = ''
    for part in parts:
        if not part:
            current = '/'
            continue
        current = f'{current}/{part}' if current != '/' else f'/{part}'
        try:
            sftp.stat(current)
        except FileNotFoundError:
            try:
                sftp.mkdir(current)
                print(f"    Created remote dir: {current}")
            except Exception as e:
                pass  # May already exist in a race


def sftp_upload(sftp, local_path, remote_path, label=None):
    """Upload a single file via SFTP with progress info."""
    size_mb = os.path.getsize(local_path) / (1024 * 1024)
    label = label or os.path.basename(local_path)
    print(f"    â†‘ Uploading {label} ({size_mb:.1f} MB)...")
    start = time.time()
    sftp.put(local_path, remote_path)
    elapsed = time.time() - start
    print(f"    âœ“ Uploaded in {elapsed:.1f}s")


def sftp_upload_dir(sftp, local_dir, remote_dir):
    """Upload an entire directory recursively."""
    sftp_mkdir_p(sftp, remote_dir)
    for item in os.listdir(local_dir):
        local_item = os.path.join(local_dir, item)
        remote_item = f"{remote_dir}/{item}"
        if os.path.isdir(local_item):
            sftp_upload_dir(sftp, local_item, remote_item)
        else:
            sftp_mkdir_p(sftp, remote_dir)
            sftp.put(local_item, remote_item)


def main():
    print("=" * 60)
    print("  SAC ERP - Deploy to SAC Test Server")
    print("=" * 60)

    # Verify JAR exists
    if not os.path.exists(JAR_LOCAL):
        print(f"\n[ERROR] JAR not found: {JAR_LOCAL}")
        print("  Please run: mvn clean package -DskipTests")
        sys.exit(1)
    jar_size = os.path.getsize(JAR_LOCAL) / (1024 * 1024)
    print(f"\nâœ“ JAR found: erp-1.0.0-SNAPSHOT.jar ({jar_size:.1f} MB)")

    # Connect via SSH
    print(f"\n[1/6] Connecting to {USERNAME}@{HOST}:{PORT}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)
        print("  âœ“ SSH Connected")
    except Exception as e:
        print(f"  [ERROR] SSH connection failed: {e}")
        sys.exit(1)

    sftp = ssh.open_sftp()

    try:
        # â”€â”€ Step 2: Prepare remote directories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        print("\n[2/6] Setting up remote directories...")
        run_remote(ssh, f"mkdir -p {REMOTE_SPRINGBOOT}/config {REMOTE_SPRINGBOOT}/logs", "Creating spring boot dirs")
        run_remote(ssh, f"mkdir -p {REMOTE_WEBROOT}", "Creating web root")
        run_remote(ssh, f"mkdir -p {REMOTE_API_DIR}", "Creating API proxy dir")

        # â”€â”€ Step 3: Stop existing Spring Boot instance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        print("\n[3/6] Stopping existing Spring Boot instance...")
        run_remote(ssh, "pkill -f 'erp.jar' 2>/dev/null || true", "Killing existing erp.jar process")
        time.sleep(3)

        # â”€â”€ Step 4: Upload JAR and config files â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        print("\n[4/6] Uploading Spring Boot JAR and configs...")
        sftp_upload(sftp, JAR_LOCAL, REMOTE_JAR, "erp.jar")

        # Upload config files
        config_files = [
            ('application-test-sacgotek.properties', f'{REMOTE_CONFIG}/application.properties'),
        ]
        for local_name, remote_path in config_files:
            local_full = os.path.join(DEPLOY_DIR, local_name)
            if os.path.exists(local_full):
                sftp_mkdir_p(sftp, os.path.dirname(remote_path))
                sftp_upload(sftp, local_full, remote_path, local_name)

        # â”€â”€ Step 5: Upload .htaccess and PHP proxy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        print("\n[5/6] Setting up web proxy (PHP + .htaccess)...")
        htaccess_local = os.path.join(DEPLOY_DIR, 'htaccess-test-sacgotek')
        php_local = os.path.join(DEPLOY_DIR, 'index-test-sacgotek.php')

        if os.path.exists(htaccess_local):
            sftp_upload(sftp, htaccess_local, f'{REMOTE_WEBROOT}/.htaccess', '.htaccess')
        if os.path.exists(php_local):
            sftp_upload(sftp, php_local, f'{REMOTE_WEBROOT}/index.php', 'index.php')

        # Upload React frontend dist if available
        if os.path.exists(REACT_DIST):
            print("\n  Uploading React frontend dist...")
            sftp_upload_dir(sftp, REACT_DIST, REMOTE_WEBROOT)
            print("  âœ“ React frontend uploaded")
        else:
            print("  ! React dist not found, skipping (run: npm run build in sac_react_frontend)")

        # â”€â”€ Step 6: Start Spring Boot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        print("\n[6/6] Starting Spring Boot application...")

        JAVA_BIN = '/home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/jdk-21.0.2+13-jre/bin/java'
        start_cmd = (
            f"nohup {JAVA_BIN} "
            f"-Xms64m -Xmx256m -Xss256k "
            f"-XX:ActiveProcessorCount=1 -XX:ParallelGCThreads=1 "
            f"-XX:CICompilerCount=2 -XX:TieredStopAtLevel=1 "
            f"-jar {REMOTE_JAR} "
            f"--spring.config.location=file:{REMOTE_CONFIG}/application.properties "
            f"--server.port=8085 "
            f"> {REMOTE_LOGS}/app.log 2>&1 &"
        )
        run_remote(ssh, start_cmd, "Starting Spring Boot in background")
        time.sleep(5)

        # Check if it started
        status_code, out, err = run_remote(ssh, f"ps aux | grep erp.jar | grep -v grep", "Checking process status")
        if out:
            print("\n  âœ“ Spring Boot is running!")
        else:
            print("\n  ! Spring Boot may not have started yet. Checking logs...")
            run_remote(ssh, f"tail -30 {REMOTE_LOGS}/app.log 2>/dev/null || echo 'No log yet'", "Last 30 lines of app log")

        # Show URL
        print("\n" + "=" * 60)
        print("  âœ“ DEPLOYMENT COMPLETE!")
        print("=" * 60)
        print(f"\n  ðŸŒ Spring Boot API: http://sac.test (via PHP proxy â†’ port 8085)")
        print(f"  ðŸ“‹ Logs: {REMOTE_LOGS}/app.log")
        print(f"\n  To check logs: ssh -p {PORT} {USERNAME}@{HOST} 'tail -f {REMOTE_LOGS}/app.log'")
        print(f"  To stop:       ssh -p {PORT} {USERNAME}@{HOST} 'pkill -f erp.jar'")

    finally:
        sftp.close()
        ssh.close()
        print("\n  SSH connection closed.")


if __name__ == '__main__':
    main()

