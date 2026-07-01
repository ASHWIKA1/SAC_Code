"""Check Spring Boot startup status - look for 'Started' or errors."""
import paramiko
import time

HOST = '82.25.120.218'
PORT = 65002
USERNAME = 'u856184323'
PASSWORD = 'Eash@2005'
REMOTE_LOGS = '/home/u856184323/sac_springboot/logs'
REMOTE_JAR = '/home/u856184323/sac_springboot/erp.jar'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)

def run(cmd, label=None):
    if label:
        print(f"\n[{label}]")
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=60)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print(f"[ERR] {err}")
    return out

print("Waiting 15 more seconds for full Spring Boot startup...")
time.sleep(15)

# Process check
run("ps aux | grep erp.jar | grep -v grep | awk '{print $1,$2,$3,$11}'", "Process status")

# Check startup log for 'Started' line
run(f"grep -i 'started\\|error\\|exception\\|failed\\|connected' {REMOTE_LOGS}/app.log | tail -20", "Key startup messages")

# Full last 15 lines
run(f"tail -15 {REMOTE_LOGS}/app.log", "Last 15 log lines")

# Check if port 8085 bound
run("cat /proc/net/tcp6 2>/dev/null | awk '{print $2}' | grep -i '00002185' || echo 'port 8085 not found in tcp6'", "Port 8085 in tcp6 (hex 2185)")
run("cat /proc/net/tcp 2>/dev/null | awk '{print $2}' | grep -i '00002185' || echo 'port 8085 not found in tcp'", "Port 8085 in tcp (hex 2185)")

ssh.close()
print("\n[Done]")
