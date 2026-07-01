@echo off
echo Running ERP Diagnostics...
echo ======================== > diagnostics_output.txt

echo [1/4] Checking PHP and artisan status... >> diagnostics_output.txt
C:\xampp\php\php.exe artisan optimize:clear >> diagnostics_output.txt 2>&1
C:\xampp\php\php.exe artisan route:list > routes_temp.txt 2>&1
echo Route count: >> diagnostics_output.txt
find /c /v "" routes_temp.txt >> diagnostics_output.txt 2>&1
del routes_temp.txt

echo. >> diagnostics_output.txt
echo [2/4] Checking database migration status... >> diagnostics_output.txt
C:\xampp\php\php.exe artisan migrate:status >> diagnostics_output.txt 2>&1

echo. >> diagnostics_output.txt
echo [3/4] Running production health check... >> diagnostics_output.txt
C:\xampp\php\php.exe production_health_check.php >> diagnostics_output.txt 2>&1

echo. >> diagnostics_output.txt
echo [4/4] Extracting recent error logs... >> diagnostics_output.txt
powershell -Command "if(Test-Path 'storage\logs\laravel.log'){ Get-Content -Tail 50 'storage\logs\laravel.log' } else { echo 'laravel.log not found' }" >> diagnostics_output.txt

echo Diagnostics complete. Please provide the contents of diagnostics_output.txt.
pause
