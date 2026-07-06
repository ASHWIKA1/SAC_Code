# PowerShell script to upload fixed files to remote server
$files = @(
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\composer.json"; Remote="erpv2/composer.json"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\.env"; Remote="erpv2/.env"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\Helper.php"; Remote="erpv2/app/Helpers/Helper.php"},
    @{Local="c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\ExamHelper.php"; Remote="erpv2/app/Helpers/ExamHelper.php"}
)

$server = "u841409365@193.202.45.164"
$port = 65002

foreach ($file in $files) {
    Write-Host "Uploading $($file.Local) to $($file.Remote)..."
    scp -P $port $file.Local "$($server):$($file.Remote)"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success!"
    } else {
        Write-Host "Failed!"
    }
}

Write-Host "All uploads complete!"
