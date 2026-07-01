"""Investigate database setup and fix proxy location on SAC test server."""
import paramiko

HOST = '82.25.120.218'
PORT = 65002
USERNAME = 'u856184323'
PASSWORD = 'Eash@2005'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)

def run(cmd, label=None):
    if label: print(f"\n[{label}]")
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print(f"[ERR] {err}")
    return out

# Check the sac-test directory structure
run("ls /home/u856184323/domains/goteksuite.com/public_html/sac-test/", "sac-test dir")
run("ls /home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/ | head -20", "testing_of_sac dir")

# Check what .env or config files are in testing_of_sac
run("cat /home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/.env 2>/dev/null | grep -i 'db\\|mysql\\|database' | head -10 || echo 'no .env'", "DB config from .env")

# Check existing PHP files there
run("ls /home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/*.php 2>/dev/null | head -10 || echo 'no php files'", "PHP files in testing_of_sac")

# Check .htaccess
run("cat /home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/.htaccess 2>/dev/null || echo 'no .htaccess'", "Existing .htaccess")

# Check what MySQL databases exist for this user
run("cat /home/u856184323/test_db.php 2>/dev/null | head -20 || echo 'no test_db.php'", "test_db.php contents")
run("cat /home/u856184323/describe_tables.php 2>/dev/null | head -10 || echo 'no describe_tables.php'", "describe_tables.php")
run("cat /home/u856184323/run_query.php 2>/dev/null | head -20 || echo 'no run_query.php'", "run_query.php")

# Check backup.sql for DB name
run("head -5 /home/u856184323/backup.sql 2>/dev/null || echo 'cannot read backup.sql'", "backup.sql header")

# Full log error trace
run("grep -i 'nullpointer\\|cannot invoke\\|datasource\\|hikari\\|flyway\\|database\\|connection refused\\|access denied' /home/u856184323/sac_springboot/logs/app.log | head -20", "DB errors in log")

# Check if Spring Boot is responding
run("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8085/actuator/health 2>/dev/null || echo 'curl failed'", "Health check")

ssh.close()
print("\n[Done]")
