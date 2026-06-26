@echo off
echo Uploading files to remote server...

scp -P 65002 "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\composer.json" u841409365@193.202.45.164:erpv2/composer.json
scp -P 65002 "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\.env" u841409365@193.202.45.164:erpv2/.env
scp -P 65002 "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\Helper.php" u841409365@193.202.45.164:erpv2/app/Helpers/Helper.php
scp -P 65002 "c:\Users\ashwi\OneDrive\Desktop\ERP V1\erp\app\Helpers\ExamHelper.php" u841409365@193.202.45.164:erpv2/app/Helpers/ExamHelper.php

echo Upload complete!
pause
