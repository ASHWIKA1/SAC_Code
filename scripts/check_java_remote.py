"""Check Java availability on the remote SAC test server and find/install JRE."""
import paramiko

HOST = '82.25.120.218'
PORT = 65002
USERNAME = 'u856184323'
PASSWORD = 'Eash@2005'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)

def run(cmd, label=None):
    if label:
        print(f"\n--- {label} ---")
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        print(out)
    if err:
        print(f"[stderr] {err}")
    return out

run("echo $PATH", "Current PATH")
run("which java 2>/dev/null || echo 'java not in PATH'", "java in PATH?")
run("find /home/u856184323 -name 'java' -type f 2>/dev/null | head -5", "Find java in home")
run("find /usr /opt /usr/local -name 'java' -type f 2>/dev/null | head -10", "Find java system-wide")
run("ls /home/u856184323/", "Home directory contents")
run("ls /home/u856184323/jre21/bin/ 2>/dev/null | head -5 || echo 'jre21 not found'", "Check jre21 dir")
run("ls /home/u856184323/jdk21/bin/ 2>/dev/null | head -5 || echo 'jdk21 not found'", "Check jdk21 dir")
run("ls /usr/lib/jvm/ 2>/dev/null || echo 'no /usr/lib/jvm'", "System JVM dir")
run("cat /proc/version 2>/dev/null", "Linux version")
run("uname -m", "Architecture")
run("cat /etc/os-release 2>/dev/null | head -5", "OS info")
run("free -m | head -3", "Memory")

ssh.close()
print("\n[Done]")
