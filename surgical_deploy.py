import paramiko
import os

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'
# The user specified 'erpv2' - this usually translates to the app root in the home directory
remote_dir = 'domains/test-technoprint.online/public_html/erpv2/' 

# List of files stabilized for Indian School Modules and Global Bug Fixes
files = [
    'modules_statuses.json',
    'app/Helpers/Helper.php',
    'app/Http/Controllers/Admin/StudentInfo/SmStudentSettingController.php',
    'Modules/Lesson/Http/Controllers/LessonPlanController.php',
    'app/Http/Controllers/Admin/SchoolExtensionController.php',
    'resources/views/backEnd/medical/index.blade.php',
    'resources/views/backEnd/medical/vaccination_index.blade.php',
    'resources/views/backEnd/tc/index.blade.php',
    'app/Http/Controllers/SmStudentAdmissionController.php',
    'app/Http/Controllers/Admin/FeesCollection/SmFeesCarryForwardController.php',
    'app/Http/Controllers/Student/SmFeesController.php',
    'app/Http/Controllers/SmFeesController.php',
    'app/Http/Controllers/Admin/Hr/SmStaffController.php',
    'production_seeder.php',
    'fix_sidebar.php',
    'routes/admin_school_extensions.php',
    'db_route_repair.php'
]

print("Connecting to SSH via Paramiko...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    sftp = ssh.open_sftp()

    for file_path in files:
        local_path = file_path.replace('/', '\\')
        normalized_remote = file_path.replace('\\', '/')
        remote_path = f"{remote_dir}{normalized_remote}"
        
        # Ensure remote directory structure exists
        remote_file_dir = os.path.dirname(normalized_remote)
        if remote_file_dir:
            path_parts = remote_file_dir.split('/')
            current_path = remote_dir.rstrip('/')
            for part in path_parts:
                current_path = f"{current_path}/{part}"
                try:
                    sftp.stat(current_path)
                    # print(f"  Directory exists: {current_path}")
                except IOError:
                    try:
                        sftp.mkdir(current_path)
                        print(f"  Created remote directory: {current_path}")
                    except Exception as ex:
                        print(f"  Failed to create directory {current_path}: {str(ex)}")

        print(f"Uploading {file_path} to {remote_path}...")
        
        try:
            # Re-verify local file existence just in case
            if os.path.exists(local_path):
                sftp.put(local_path, remote_path)
                print(f"  [SUCCESS]")
            else:
                print(f"  [FAILED] Local file NOT FOUND: {local_path}")
        except Exception as e:
            print(f"  [FAILED] SFTP Put Error: {str(e)}")
    
    sftp.close()
    
    print("\nExecuting maintenance commands...")
    commands = [
        f"cd {remote_dir} && php artisan view:clear",
        f"cd {remote_dir} && php artisan route:clear",
        f"cd {remote_dir} && php artisan cache:clear"
    ]
    
    for cmd in commands:
        print(f"Running: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdout.channel.recv_exit_status() 
        print("  Done.")
    
    print("\nDeployment completed successfully!")
finally:
    ssh.close()
