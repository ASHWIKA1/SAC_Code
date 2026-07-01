"""Start Spring Boot on SAC test server using the discovered Java path."""
import paramiko
import time

HOST = '82.25.120.218'
PORT = 65002
USERNAME = 'u856184323'
PASSWORD = 'Eash@2005'

JAVA_BIN = '/home/u856184323/domains/goteksuite.com/public_html/sac-test/testing_of_sac/jdk-21.0.2+13-jre/bin/java'
REMOTE_JAR = '/home/u856184323/sac_springboot/erp.jar'
REMOTE_CONFIG = '/home/u856184323/sac_springboot/config/application.properties'
REMOTE_LOGS = '/home/u856184323/sac_springboot/logs'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)

def run(cmd, label=None):
    if label:
        print(f"\n[{label}]")
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=60)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        print(out)
    if err:
        print(f"[ERR] {err}")
    return exit_code, out, err

# Verify Java works
run(f"{JAVA_BIN} -version 2>&1", "Verify Java 21")

# Kill any existing instance
run("pkill -f 'erp.jar' 2>/dev/null || true", "Stop existing erp.jar")
time.sleep(2)

# Create log dir
run(f"mkdir -p {REMOTE_LOGS}", "Ensure log dir")

# Start Spring Boot
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
run(start_cmd, "Start Spring Boot")

print("\nWaiting 12 seconds for startup...")
time.sleep(12)

# Check process
code, out, err = run("ps aux | grep erp.jar | grep -v grep", "Check process")
if out:
    print("\n[OK] Spring Boot IS RUNNING!")
else:
    print("\n[WARN] Process not visible yet, checking logs...")

# Show last 40 lines of log
run(f"tail -40 {REMOTE_LOGS}/app.log 2>/dev/null || echo 'No log yet'", "App startup log")

# Test if port 8085 is listening
run("ss -tlnp 2>/dev/null | grep 8085 || netstat -tlnp 2>/dev/null | grep 8085 || echo 'Port check unavailable'", "Port 8085 listening?")

ssh.close()
print("\n[Done]")
