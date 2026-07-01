$ErrorActionPreference = "Stop"

$files = @{
    "composer.json" = "erpv2/composer.json"
    ".env" = "erpv2/.env"
    "app\Helpers\Helper.php" = "erpv2/app/Helpers/Helper.php"
    "app\Helpers\ExamHelper.php" = "erpv2/app/Helpers/ExamHelper.php"
}

$server = "u841409365@193.202.45.164"
$port = 65002
$password = "eash@2005"

foreach ($file in $files.Keys) {
    $localPath = "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\$file"
    $remotePath = $files[$file]
    
    Write-Host "Uploading $file to $remotePath..."
    
    # Use pscp from PuTTY if available
    $pscpPath = "C:\Program Files\PuTTY\pscp.exe"
    if (Test-Path $pscpPath) {
        & $pscpPath -P $port -pw $password $localPath "$server`:$remotePath"
    } else {
        # Try using scp from OpenSSH
        & scp -P $port $localPath "$server`:$remotePath"
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success: $file uploaded"
    } else {
        Write-Host "Failed: $file"
    }
}

Write-Host "Upload process complete"
