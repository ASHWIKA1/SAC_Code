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
    sftp = ssh.open_sftp()
    
    # Upload SchoolExtensionController.php
    sftp.put(r'c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\Admin\SchoolExtensionController.php', 
             remote_dir + 'app/Http/Controllers/Admin/SchoolExtensionController.php')
    
    # Upload vaccination_index.blade.php
    sftp.put(r'c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\resources\views\backEnd\medical\vaccination_index.blade.php', 
             remote_dir + 'resources/views/backEnd/medical/vaccination_index.blade.php')

    # Upload medical_index.blade.php
    sftp.put(r'c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\resources\views\backEnd\medical\index.blade.php', 
             remote_dir + 'resources/views/backEnd/medical/index.blade.php')
             
    # Upload tc_index.blade.php
    sftp.put(r'c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\resources\views\backEnd\tc\index.blade.php', 
             remote_dir + 'resources/views/backEnd/tc/index.blade.php')             

    sftp.close()
    
    # Clear view cache on the server
    stdin, stdout, stderr = ssh.exec_command(f"cd {remote_dir} && php artisan view:clear")
    print(stdout.read().decode('utf-8'))

    print("Successfully patched Medical, Vaccination, and TC modules.")
finally:
    ssh.close()
