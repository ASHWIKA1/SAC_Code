@echo off
setlocal enabledelayedexpansion

set SERVER=u841409365@193.202.45.164
set PORT=65002
set PASSWORD=eash@2005

echo Uploading composer.json...
type "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\composer.json" | plink -P %PORT% -pw %PASSWORD% %SERVER% "cd erpv2 && cat > composer.json"

echo Uploading .env...
type "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\.env" | plink -P %PORT% -pw %PASSWORD% %SERVER% "cd erpv2 && cat > .env"

echo Uploading Helper.php...
type "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\Helper.php" | plink -P %PORT% -pw %PASSWORD% %SERVER% "cd erpv2 && mkdir -p app/Helpers && cat > app/Helpers/Helper.php"

echo Uploading ExamHelper.php...
type "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\ExamHelper.php" | plink -P %PORT% -pw %PASSWORD% %SERVER% "cd erpv2 && cat > app/Helpers/ExamHelper.php"

echo All uploads complete!
pause
