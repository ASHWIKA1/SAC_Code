# Upload fixed files to remote server using PowerShell
$ErrorActionPreference = "Stop"

# File mappings
$files = @(
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\modules_statuses.json"; Remote="erpv2/modules_statuses.json"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\Helper.php"; Remote="erpv2/app/Helpers/Helper.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\Admin\StudentInfo\SmStudentSettingController.php"; Remote="erpv2/app/Http/Controllers/Admin/StudentInfo/SmStudentSettingController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\Modules\Lesson\Http\Controllers\LessonPlanController.php"; Remote="erpv2/Modules/Lesson/Http/Controllers/LessonPlanController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\Admin\SchoolExtensionController.php"; Remote="erpv2/app/Http/Controllers/Admin/SchoolExtensionController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\SmStudentAdmissionController.php"; Remote="erpv2/app/Http/Controllers/SmStudentAdmissionController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\Admin\FeesCollection\SmFeesCarryForwardController.php"; Remote="erpv2/app/Http/Controllers/Admin/FeesCollection/SmFeesCarryForwardController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\Student\SmFeesController.php"; Remote="erpv2/app/Http/Controllers/Student/SmFeesController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\SmFeesController.php"; Remote="erpv2/app/Http/Controllers/SmFeesController.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Http\Controllers\Admin\Hr\SmStaffController.php"; Remote="erpv2/app/Http/Controllers/Admin/Hr/SmStaffController.php"}
)

$server = "u841409365@193.202.45.164"
$port = 65002

Write-Host "Starting file upload..."
Write-Host "Server: $server -P $port"
Write-Host ""

foreach ($f in $files) {
    $src = $f.Local
    $dest = "$($server):$($f.Remote)"
    
    Write-Host "Uploading: $src"
    
    if (Test-Path $src) {
        try {
            # Use scp with specific port and non-interactive options
            # If it requires a password, it will now fail immediately instead of hanging
            & scp -P $port -o StrictHostKeyChecking=no -o BatchMode=yes $src $dest
            
            if ($LastExitCode -eq 0) {
                Write-Host "  [SUCCESS] Uploaded safely."
            } else {
                Write-Host "  [FAILURE] SCP failed with exit code $LastExitCode. This usually means no SSH key is set up or the server refused connection."
            }
        } catch {
            Write-Host "  [ERROR] PowerShell error: $($_.Exception.Message)"
        }
    } else {
        Write-Host "  [ERROR] Local file not found: $src"
    }
    Write-Host "-----------------------------------"
}

Write-Host "Deployment finished."
