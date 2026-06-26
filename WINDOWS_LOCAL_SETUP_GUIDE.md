# SAC developed by TIS Windows Local Setup Guide

This guide provides step-by-step instructions to run SAC developed by TIS on Windows without license validation timeout errors.

---

## 1. System Requirements

- **OS**: Windows 10 or 11 (64-bit)
- **RAM**: 8GB Minimum (16GB Recommended)
- **Disk Space**: 2GB for Application + Database
- **Browser**: Chrome, Firefox, or Edge

---

## 2. Install XAMPP (PHP 8.2+)

1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Choose version with **PHP 8.2** or higher
3. Install to default directory: `C:\xampp`
4. Start **Apache** and **MySQL** from XAMPP Control Panel

---

## 3. Install ionCube Loader (CRITICAL)

SAC developed by TIS files are protected with ionCube. The app will not run without this.

1. Download Windows (64-bit) "Zip" for PHP 8.2 from [ioncube.com/loaders.php](https://www.ioncube.com/loaders.php)
2. Extract and find `ioncube_loader_win_8.2.dll`
3. Copy to: `C:\xampp\php\ext\`
4. Open `C:\xampp\php\php.ini`
5. **VERY IMPORTANT**: Add as the **FIRST LINE**:
   ```ini
   zend_extension = "C:\xampp\php\ext\ioncube_loader_win_8.2.dll"
   ```
6. Restart Apache in XAMPP Control Panel

---

## 4. Configure PHP (php.ini)

Open `C:\xampp\php\php.ini` and update:

```ini
; Enable extensions
extension=zip
extension=openssl

; Resource Limits
max_execution_time = 600
max_input_time = 600
memory_limit = 512M
post_max_size = 128M
upload_max_filesize = 128M

; Disable external license checks (CRITICAL)
allow_url_fopen = On
allow_url_include = Off
```

Save and restart Apache.

---

## 5. Database Setup

1. Open Command Prompt or PowerShell
2. Run MySQL command:
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE sac developed by TIS;"
   ```

3. Import the database dump (if provided):
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root sac developed by TIS < local_sac developed by TIS_dump.sql
   ```

---

## 6. Project Setup

### A. Copy Project Files
1. Copy all project files to `C:\xampp\htdocs\sac developed by TIS\`
2. Or keep in your preferred location and create a symlink

### B. Configure Environment (.env)

Create or edit `.env` file in project root:

```env
APP_NAME="SAC developed by TIS School"
APP_ENV=local
APP_KEY=base64:zfetPJ+MmQCoS2wXNzIzZsA34EwnINV3aflqFSHkP2s=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# CRITICAL: Enable test mode to bypass license validation
APP_PRO=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sac developed by TIS
DB_USERNAME=root
DB_PASSWORD=

LOG_CHANNEL=daily
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Optional: Mail settings for testing
MAIL_MAILER=log
```

---

## 7. CRITICAL FIX: Bypass License Timeout

This step prevents the "Maximum execution time exceeded" error from the TIS license validator.

### Step 1: Backup Original File
```powershell
copy "vendor\spondonit\service\helpers\helper.php" "vendor\spondonit\service\helpers\helper.php.backup"
```

### Step 2: Replace with Bypass Stub

Open `vendor\spondonit\service\helpers\helper.php` and replace ALL contents with:

```php
<?php

if (!function_exists('isTestMode')) {
    function isTestMode() {
        return true;
    }
}

if (!function_exists('isConnected')) {
    function isConnected() {
        return false;
    }
}

if (!function_exists('verifyUrl')) {
    function verifyUrl($url = '') {
        return 'http://127.0.0.1';
    }
}

if (!function_exists('app_url')) {
    function app_url() {
        return url('/');
    }
}

if (!function_exists('gv')) {
    function gv($array, $key, $default = null) {
        return $array[$key] ?? $default;
    }
}

if (!function_exists('gbv')) {
    function gbv($array, $key) {
        return $array[$key] ?? 0;
    }
}
```

### Step 3: Create Access Log File

Create an empty file at `storage\app\.access_log` with today's date:
```powershell
Get-Date -Format "yyyy-MM-dd" | Out-File -FilePath "storage\app\.access_log" -NoNewline
```

This prevents daily license server checks.

### Step 4: Create App Installed Flag (CRITICAL)

Create these files to prevent the `/install` redirect:

```powershell
# Create .app_installed file with content "1"
"1" | Out-File -FilePath "storage\app\.app_installed" -NoNewline

# Create .temp_app_installed file (prevents database check loop)
"1" | Out-File -FilePath "storage\app\.temp_app_installed" -NoNewline
```

**Why this matters**: Without these files, the app will redirect to `/install` thinking it's not installed yet.

---

## 8. Clear Caches

Run these commands from project directory:

```powershell
& "C:\xampp\php\php.exe" artisan config:clear
& "C:\xampp\php\php.exe" artisan cache:clear
& "C:\xampp\php\php.exe" artisan view:clear
```

Or manually delete:
- `bootstrap\cache\*.php`
- `storage\framework\cache\data\*`
- `storage\framework\views\*`

---

## 9. Run the Application

**IMPORTANT**: Do NOT use `php artisan serve`. Use this command instead:

```powershell
cd C:\path\to\sac developed by TIS
& "C:\xampp\php\php.exe" -S 127.0.0.1:8000 server.php
```

Keep this terminal window open while using the app.

---

## 10. Access the Application

- **Main URL**: http://127.0.0.1:8000
- **Login URL**: http://127.0.0.1:8000/login

### Default Admin Credentials:
| Field | Value |
|-------|-------|
| Email | `admin@sac developed by TIS.com` |
| Password | `123456` |

---

## 11. Troubleshooting

### Issue: "Maximum execution time exceeded" in spondonit helper
**Solution**: Ensure you completed Step 7 (replacing helper.php) and Step 3 (ionCube).

### Issue: 404 errors for CSS/JS files
**Solution**: Make sure you're running `server.php` from the root directory, not `index.php`.

### Issue: Database connection failed
**Solution**: Check XAMPP MySQL is running and `.env` has correct DB credentials.

### Issue: ionCube errors
**Solution**: Verify `zend_extension` is the **first line** in `php.ini` and matches your PHP version.

### Issue: Blank white page
**Solution**: Check `storage/logs/laravel.log` for errors. Ensure `storage` and `bootstrap/cache` folders are writable.

### Issue: Keeps redirecting to `/install` page
**Solution**: Create these files in `storage\app\`:
```powershell
"1" | Out-File -FilePath "storage\app\.app_installed" -NoNewline
"1" | Out-File -FilePath "storage\app\.temp_app_installed" -NoNewline
```
Also verify database has tables and `.env` DB credentials are correct.

---

## 12. Alternative: Using Apache Virtual Host

Instead of `php -S`, you can configure Apache:

1. Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/path/to/sac developed by TIS/public"
       ServerName sac developed by TIS.local
       <Directory "C:/path/to/sac developed by TIS/public">
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

2. Edit `C:\Windows\System32\drivers\etc\hosts`:
   ```
   127.0.0.1  sac developed by TIS.local
   ```

3. Restart Apache and access: http://sac developed by TIS.local

---

## Summary of Critical Fixes

| Issue | Fix Location | Action |
|-------|-------------|--------|
| License timeout | `.env` | Add `APP_PRO=true` |
| License timeout | `vendor/spondonit/service/helpers/helper.php` | Replace with stub functions |
| License timeout | `storage/app/.access_log` | Create with today's date |
| /install redirect | `storage/app/` | Create `.app_installed` and `.temp_app_installed` |
| ionCube errors | `php.ini` | Add `zend_extension` as first line |
| Database | MySQL | Create `sac developed by TIS` database |
| Environment | `.env` | Set local DB credentials |

---

**Note**: This setup is for local development/testing only. Production deployments require valid licenses from the software vendor.
