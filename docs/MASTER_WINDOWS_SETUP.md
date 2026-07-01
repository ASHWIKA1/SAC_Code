# SAC developed by TIS Master Setup Guide for Windows

**Complete step-by-step guide to run SAC developed by TIS on Windows with all dependencies and fixes.**

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Download & Install Dependencies](#2-download--install-dependencies)
3. [Database Setup](#3-database-setup)
4. [Project Configuration](#4-project-configuration)
5. [Critical Fixes (License Bypass)](#5-critical-fixes-license-bypass)
6. [Run the Application](#6-run-the-application)
7. [Access & Login](#7-access--login)
8. [Troubleshooting](#8-troubleshooting)
9. [Quick Reference Commands](#9-quick-reference-commands)

---

## 1. Prerequisites

### System Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Windows 10/11 (64-bit) | Windows 11 (64-bit) |
| RAM | 8 GB | 16 GB |
| Disk Space | 2 GB free | 5 GB free |
| Processor | Intel i3 / AMD Ryzen 3 | Intel i5 / AMD Ryzen 5 |

### Required Software (Download Links)
1. **XAMPP** (PHP 8.2+) - [apachefriends.org](https://www.apachefriends.org/)
2. **ionCube Loader** - [ioncube.com/loaders.php](https://www.ioncube.com/loaders.php)
3. **Git** (optional) - [git-scm.com](https://git-scm.com/)

---

## 2. Download & Install Dependencies

### Step 2.1: Install XAMPP

1. Download **XAMPP for Windows** with **PHP 8.2.x**
2. Run installer as Administrator
3. Install to: `C:\xampp`
4. Select these components:
   - ☑ Apache
   - ☑ MySQL
   - ☑ PHP
   - ☑ phpMyAdmin (optional)
5. Complete installation
6. **DO NOT START XAMPP YET**

### Step 2.2: Install ionCube Loader

**CRITICAL**: SAC developed by TIS won't run without ionCube.

1. Download **Windows VC16 (64 bits)** ZIP for **PHP 8.2**
2. Extract ZIP file
3. Find: `ioncube_loader_win_8.2.dll`
4. Copy to: `C:\xampp\php\ext\`

#### Configure php.ini

1. Open: `C:\xampp\php\php.ini`
2. **VERY IMPORTANT**: Add as **FIRST LINE** of file:
   ```ini
   zend_extension = "C:\xampp\php\ext\ioncube_loader_win_8.2.dll"
   ```

3. Find and update these settings:
   ```ini
   ; File uploads
   file_uploads = On
   upload_max_filesize = 128M
   post_max_size = 128M
   max_file_uploads = 20
   
   ; Execution limits
   max_execution_time = 600
   max_input_time = 600
   memory_limit = 512M
   max_input_vars = 10000
   
   ; Extensions
   extension=openssl
   extension=pdo_mysql
   extension=mysqli
   extension=zip
   
   ; Timezone
   date.timezone = Asia/Kolkata
   ```

4. Save and close

### Step 2.3: Start XAMPP

1. Open **XAMPP Control Panel** (as Administrator)
2. Click **Start** for Apache
3. Click **Start** for MySQL
4. Both should show green/running
5. Click **Config** → **Service and Port Settings** to verify ports (Apache: 80/443, MySQL: 3306)

**Verify ionCube:**
```powershell
& "C:\xampp\php\php.exe" -m | findstr ioncube
```
Should show: `ionCube Loader`

---

## 3. Database Setup

### Step 3.1: Create Database

Open PowerShell or Command Prompt:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS sac developed by TIS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 3.2: Import Database (If you have SQL dump)

```powershell
cd C:\path\to\your\sql\file
& "C:\xampp\mysql\bin\mysql.exe" -u root sac developed by TIS < local_sac developed by TIS_dump.sql
```

**If no SQL dump exists**, the app will create tables automatically on first run.

### Step 3.3: Verify Database

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "SHOW DATABASES;"
```
Should show: `sac developed by TIS`

---

## 4. Project Configuration

### Step 4.1: Copy Project Files

1. Copy entire project folder to:
   ```
   C:\xampp\htdocs\sac developed by TIS\
   ```

2. Or create a folder anywhere and create symlink:
   ```powershell
   # Run as Administrator
   mklink /D "C:\xampp\htdocs\sac developed by TIS" "C:\your\actual\path\sac developed by TIS"
   ```

### Step 4.2: Create .env File

In project root (`C:\xampp\htdocs\sac developed by TIS\`), create file named `.env`:

```env
APP_NAME="SAC developed by TIS School Management"
APP_ENV=local
APP_KEY=base64:zfetPJ+MmQCoS2wXNzIzZsA34EwnINV3aflqFSHkP2s=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
APP_PRO=true

LOG_CHANNEL=daily
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sac developed by TIS
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@school.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
PAGINATION_LIMIT=20
```

**CRITICAL FIELDS:**
- `APP_PRO=true` → Bypasses license validation
- `DB_DATABASE=sac developed by TIS` → Your database name
- `DB_PASSWORD=` → Empty for XAMPP default (root has no password)

### Step 4.3: Set Folder Permissions

Right-click project folder → Properties → Security → Edit → Add:
- Give **Full Control** to:
  - `Everyone`
  - `IUSR`
  - `IIS_IUSRS`

Or run PowerShell as Administrator:
```powershell
$path = "C:\xampp\htdocs\sac developed by TIS"
icacls $path /grant Everyone:F /T
icacls "$path\storage" /grant Everyone:F /T
icacls "$path\bootstrap\cache" /grant Everyone:F /T
```

---

## 5. Critical Fixes (License Bypass)

**Without these fixes, you'll get:**
- "Maximum execution time exceeded" error
- Redirect to `/install` page
- License validation timeouts

### Fix 1: Create Storage Flag Files

Create these files in `storage\app\`:

```powershell
cd C:\xampp\htdocs\sac developed by TIS

# Create .app_installed (tells app it's installed)
"1" | Out-File -FilePath "storage\app\.app_installed" -NoNewline

# Create .temp_app_installed (prevents database check loop)
"1" | Out-File -FilePath "storage\app\.temp_app_installed" -NoNewline

# Create .access_log (prevents daily license checks)
Get-Date -Format "yyyy-MM-dd" | Out-File -FilePath "storage\app\.access_log" -NoNewline

# Create .version (optional, version tracking)
"9.0.3" | Out-File -FilePath "storage\app\.version" -NoNewline
```

### Fix 2: Replace License Helper (MOST CRITICAL)

**Backup original first:**
```powershell
copy "C:\xampp\htdocs\sac developed by TIS\vendor\spondonit\service\helpers\helper.php" "C:\xampp\htdocs\sac developed by TIS\vendor\spondonit\service\helpers\helper.php.backup"
```

**Replace with bypass stub:**

Open `C:\xampp\htdocs\sac developed by TIS\vendor\spondonit\service\helpers\helper.php` in Notepad/VS Code, **DELETE ALL CONTENT**, and paste:

```php
<?php

/**
 * License Bypass Stub for Local Development
 * Original file backed up as helper.php.backup
 */

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

if (!function_exists('gReCaptcha')) {
    function gReCaptcha() {
        return null;
    }
}
```

**Save the file.**

### Fix 3: Clear All Caches

```powershell
cd C:\xampp\htdocs\sac developed by TIS

# Clear config cache
& "C:\xampp\php\php.exe" artisan config:clear

# Clear application cache
& "C:\xampp\php\php.exe" artisan cache:clear

# Clear view cache
& "C:\xampp\php\php.exe" artisan view:clear

# Clear route cache
& "C:\xampp\php\php.exe" artisan route:clear

# If any of the above fail, manually delete:
Remove-Item "bootstrap\cache\*.php" -ErrorAction SilentlyContinue
Remove-Item "storage\framework\cache\data\*" -Recurse -ErrorAction SilentlyContinue
Remove-Item "storage\framework\views\*" -ErrorAction SilentlyContinue
```

---

## 6. Run the Application

### Method A: PHP Built-in Server (Recommended for Testing)

```powershell
cd C:\xampp\htdocs\sac developed by TIS
& "C:\xampp\php\php.exe" -S 127.0.0.1:8000 server.php
```

**Keep this PowerShell window open!** Closing it stops the server.

### Method B: Apache Virtual Host (Recommended for Development)

**1. Edit Apache config:**

Open: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`

Add at bottom:
```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/sac developed by TIS"
    ServerName sac developed by TIS.local
    
    <Directory "C:/xampp/htdocs/sac developed by TIS">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "logs/sac developed by TIS-error.log"
    CustomLog "logs/sac developed by TIS-access.log" common
</VirtualHost>
```

**2. Edit Windows hosts file:**

Open as Administrator: `C:\Windows\System32\drivers\etc\hosts`

Add:
```
127.0.0.1  sac developed by TIS.local
```

**3. Restart Apache** from XAMPP Control Panel

**4. Access:** http://sac developed by TIS.local

---

## 7. Access & Login

### URLs
| Purpose | URL |
|---------|-----|
| Main Site | http://127.0.0.1:8000 |
| Login | http://127.0.0.1:8000/login |
| Admin Panel | http://127.0.0.1:8000/admin-dashboard |

### Default Admin Credentials
```
Email:    admin@sac developed by TIS.com
Password: 123456
```

### First Login Steps
1. Go to http://127.0.0.1:8000/login
2. Enter credentials above
3. If successful, you'll reach the Dashboard
4. **Immediately change password** from Profile → Change Password

---

## 8. Troubleshooting

### Issue: "Maximum execution time exceeded" in spondonit helper
**Cause:** License validation trying to connect to external server
**Fix:** 
- Ensure `APP_PRO=true` in `.env`
- Ensure `vendor/spondonit/service/helpers/helper.php` was replaced with stub
- Ensure `storage/app/.access_log` exists

### Issue: Keeps redirecting to `/install`
**Cause:** Missing flag files
**Fix:**
```powershell
"1" | Out-File -FilePath "storage\app\.app_installed" -NoNewline
"1" | Out-File -FilePath "storage\app\.temp_app_installed" -NoNewline
```

### Issue: ionCube Loader error
**Cause:** ionCube not installed or wrong version
**Fix:**
- Verify PHP version: `php -v` (should show 8.2.x)
- Download matching ionCube loader for PHP 8.2
- Ensure `zend_extension` is first line in `php.ini`
- Restart Apache after changes

### Issue: Database connection failed
**Cause:** Wrong DB credentials or MySQL not running
**Fix:**
- Check XAMPP MySQL is running (green in Control Panel)
- Verify `.env` has:
  ```
  DB_DATABASE=sac developed by TIS
  DB_USERNAME=root
  DB_PASSWORD=
  ```
- Test MySQL: `& "C:\xampp\mysql\bin\mysql.exe" -u root -e "SELECT 1;"`

### Issue: 404 errors for CSS/JS
**Cause:** Not using server.php or wrong document root
**Fix:**
- Use: `php -S 127.0.0.1:8000 server.php`
- NOT: `php artisan serve` or `php -S 127.0.0.1:8000`

### Issue: Blank white page
**Cause:** PHP error suppressed
**Fix:**
- Check `storage/logs/laravel.log`
- Set `APP_DEBUG=true` in `.env`
- Clear caches

### Issue: Permission denied
**Cause:** Windows folder permissions
**Fix:**
```powershell
icacls "C:\xampp\htdocs\sac developed by TIS" /grant Everyone:F /T
```

### Issue: Port 8000 already in use
**Fix:**
```powershell
# Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Or use different port
php -S 127.0.0.1:8080 server.php
```

---

## 9. Quick Reference Commands

### Start Server
```powershell
cd C:\xampp\htdocs\sac developed by TIS
& "C:\xampp\php\php.exe" -S 127.0.0.1:8000 server.php
```

### Stop Server
Press `Ctrl+C` in the PowerShell window, or close the window.

### Reset Everything
```powershell
cd C:\xampp\htdocs\sac developed by TIS

# Clear all caches
& "C:\xampp\php\php.exe" artisan cache:clear
& "C:\xampp\php\php.exe" artisan config:clear
& "C:\xampp\php\php.exe" artisan view:clear

# Recreate flag files
"1" | Out-File -FilePath "storage\app\.app_installed" -NoNewline
"1" | Out-File -FilePath "storage\app\.temp_app_installed" -NoNewline
Get-Date -Format "yyyy-MM-dd" | Out-File -FilePath "storage\app\.access_log" -NoNewline
```

### Check MySQL Status
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "STATUS;"
```

### View Logs
```powershell
# Laravel logs
Get-Content "storage\logs\laravel.log" -Tail 50

# Apache error logs
Get-Content "C:\xampp\apache\logs\error.log" -Tail 50
```

---

## Summary Checklist

Before starting server, verify:

- [ ] XAMPP installed with PHP 8.2+
- [ ] ionCube Loader installed and configured
- [ ] Apache and MySQL running in XAMPP
- [ ] Database `sac developed by TIS` created
- [ ] `.env` file created with `APP_PRO=true`
- [ ] `storage/app/.app_installed` exists (content: `1`)
- [ ] `storage/app/.temp_app_installed` exists (content: `1`)
- [ ] `vendor/spondonit/service/helpers/helper.php` replaced with stub
- [ ] Caches cleared
- [ ] Folder permissions set

---

**Note:** This setup is for local development/testing only. Production use requires valid licenses from the software vendor.

**Created:** April 2026  
**Tested on:** Windows 10/11, XAMPP 8.2.x, PHP 8.2.x
