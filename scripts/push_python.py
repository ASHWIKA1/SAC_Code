import paramiko
import os

hostname = '193.202.45.164'
port = 65002
username = 'u841409365'
password = 'Eash@2005'
remote_dir = 'domains/test-technoprint.online/public_html/erpv2/'

files = [
    'app/Http/Controllers/Admin/SchoolExtensionController.php',
    'resources/views/backEnd/tc/index.blade.php',
    'resources/views/backEnd/medical/index.blade.php',
    'resources/views/backEnd/systemSettings/user/user_create.blade.php',
    'resources/views/backEnd/superAdmin/tenantUsers/students.blade.php',
    'resources/views/backEnd/studentPanel/my_profile_update.blade.php',
    'resources/views/backEnd/studentInformation/student_report.blade.php',
    'resources/views/backEnd/studentInformation/student_edit.blade.php',
    'resources/views/backEnd/studentInformation/student_admission.blade.php',
    'resources/views/backEnd/parentPanel/update_my_children.blade.php',
    'resources/views/backEnd/humanResource/editStaff.blade.php',
    'resources/views/backEnd/humanResource/addStaff.blade.php',
    'resources/views/backEnd/frontSettings/donor/donor.blade.php',
    'resources/views/backEnd/medical/vaccination_index.blade.php',
    'resources/views/backEnd/bookBank/index.blade.php',
    'resources/views/backEnd/bookBank/issue.blade.php',
    'resources/views/backEnd/bookBank/thirukkural.blade.php',
    'resources/views/backEnd/vendor/index.blade.php',
    'resources/views/backEnd/vendor/purchase_orders.blade.php',
    'resources/views/backEnd/vendor/payments.blade.php',
    'resources/views/backEnd/hostel/index.blade.php',
    'resources/views/backEnd/hostel/allocation.blade.php',
    'resources/views/backEnd/hostel/fee.blade.php',
    'resources/views/backEnd/hostel/rooms.blade.php'
]

print("Connecting to SSH...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, port=port, username=username, password=password)
    
    sftp = ssh.open_sftp()

    for file in files:
        local_path = file
        remote_path = f"{remote_dir}{file}"
        print(f"Uploading {file}...")
        sftp.put(local_path, remote_path)
    
    sftp.close()
    
    print("Upload complete. Executing deployment commands...")
    
    commands = [
        f"cd {remote_dir} && php artisan migrate",
        f"cd {remote_dir} && php artisan view:clear",
        f"cd {remote_dir} && php artisan cache:clear",
        f"cd {remote_dir} && touch public/.htaccess"
    ]
    
    for cmd in commands:
        print(f"Running: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status() 
        print("Output:\n", stdout.read().decode())
        if exit_status != 0:
            print("Error:\n", stderr.read().decode())
    
    print("Deployment completed successfully!")
finally:
    ssh.close()
