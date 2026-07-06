#!/bin/bash

# Ensure storage directories exist
mkdir -p /var/www/storage/app/public
mkdir -p /var/www/storage/framework/cache/data
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/bootstrap/cache

# Fix Permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    # Update .env for Docker
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=mysql/g' .env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=sac developed by TIS/g' .env
    sed -i 's/DB_USERNAME=root/DB_USERNAME=root/g' .env
    sed -i 's/DB_PASSWORD=/DB_PASSWORD=root/g' .env
    sed -i 's/APP_URL=http:\/\/localhost/APP_URL=http:\/\/localhost:8888/g' .env
fi

# License Bypass Flags
echo "1" > /var/www/storage/app/.app_installed
echo "1" > /var/www/storage/app/.temp_app_installed
date +%Y-%m-%d > /var/www/storage/app/.access_log
echo "9.0.3" > /var/www/storage/app/.version

# License Helper Stub (Most Critical)
HELPER_PATH="/var/www/vendor/spondonit/service/helpers/helper.php"
if [ -f "$HELPER_PATH" ]; then
    cat <<EOF > "$HELPER_PATH"
<?php
if (!function_exists('isTestMode')) { function isTestMode() { return true; } }
if (!function_exists('isConnected')) { function isConnected() { return false; } }
if (!function_exists('verifyUrl')) { function verifyUrl(\$url = '') { return 'http://127.0.0.1'; } }
if (!function_exists('app_url')) { function app_url() { return url('/'); } }
if (!function_exists('gv')) { function gv(\$array, \$key, \$default = null) { return \$array[\$key] ?? \$default; } }
if (!function_exists('gbv')) { function gbv(\$array, \$key) { return \$array[\$key] ?? 0; } }
if (!function_exists('gReCaptcha')) { function gReCaptcha() { return null; } }
EOF
fi

# Laravel Init
php artisan key:generate --force
php artisan storage:link --force
php artisan cache:clear
php artisan config:clear

# Start PHP-FPM
php-fpm
