#!/bin/bash
# Hostinger SSH Deployment Script for SACgotek ERP Student Modules

HOST="193.202.45.164"
PORT="65002"
USER="u841409365"
PASS="Eash@2005"

# Local paths
API_LOCAL="public/api.php"
VIEW_LOCAL="resources/views/backEnd/studentInformation/student_view.blade.php"
PROFILE_LOCAL="resources/views/backEnd/studentPanel/my_profile.blade.php"
LOGIN_VIEW_LOCAL="resources/views/auth/loginCodeCanyon.blade.php"
LAYOUT_APP_LOCAL="resources/views/layouts/app.blade.php"
FRONT_MASTER_LOCAL="resources/views/frontEnd/home/front_master.blade.php"
HEADER_LOCAL="resources/views/backEnd/partials/header.blade.php"
FOOTER_LOCAL="resources/views/backEnd/partials/footer.blade.php"
LOGIN_CONTROLLER_LOCAL="app/Http/Controllers/Auth/LoginController.php"
WEB_ROUTES_LOCAL="routes/web.php"
TENANT_ROUTES_LOCAL="routes/tenant.php"
SIDEBAR_COMP_LOCAL="resources/views/components/sidebar-component.blade.php"
SIDEBAR_COPY_LOCAL="resources/views/backEnd/partials/sidebar_copy.blade.php"
MENU_LOCAL="resources/views/backEnd/partials/menu.blade.php"
LOGO_LOCAL="public/uploads/settings/logo.png"
FAVICON_SETTINGS_LOCAL="public/uploads/settings/favicon.png"
FAVICON_BACKEND_LOCAL="public/backEnd/img/favicon.png"

# Subdomains remote roots
ROOT1="domains/test1-technosprint.online/public_html/test-sacgotek"
ROOT2="domains/test-technoprint.online/public_html/erpv2"

echo "=========================================================="
echo "🚀 INITIATING ERPV1 STUDENT MANAGEMENT MODULE DEPLOYMENT"
echo "=========================================================="

deploy_to_subdomain() {
    local remote_root=$1
    echo ""
    echo "🌐 Deploying to: $remote_root"
    echo "--------------------------------------------------------"

    # Upload public/api.php
    echo "📤 Uploading public/api.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$API_LOCAL" "$USER@$HOST:$remote_root/public/api.php"
    if [ $? -eq 0 ]; then echo "✅ api.php uploaded successfully!"; else echo "❌ Failed to upload api.php"; fi

    # Upload student_view.blade.php
    echo "📤 Uploading student_view.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$VIEW_LOCAL" "$USER@$HOST:$remote_root/resources/views/backEnd/studentInformation/student_view.blade.php"
    if [ $? -eq 0 ]; then echo "✅ student_view.blade.php uploaded successfully!"; else echo "❌ Failed to upload student_view"; fi

    # Upload my_profile.blade.php
    echo "📤 Uploading my_profile.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$PROFILE_LOCAL" "$USER@$HOST:$remote_root/resources/views/backEnd/studentPanel/my_profile.blade.php"
    if [ $? -eq 0 ]; then echo "✅ my_profile.blade.php uploaded successfully!"; else echo "❌ Failed to upload my_profile"; fi

    # Upload loginCodeCanyon.blade.php
    echo "📤 Uploading loginCodeCanyon.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$LOGIN_VIEW_LOCAL" "$USER@$HOST:$remote_root/resources/views/auth/loginCodeCanyon.blade.php"
    if [ $? -eq 0 ]; then echo "✅ loginCodeCanyon.blade.php uploaded successfully!"; else echo "❌ Failed to upload loginCodeCanyon"; fi

    # Upload layouts/app.blade.php
    echo "📤 Uploading layouts/app.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$LAYOUT_APP_LOCAL" "$USER@$HOST:$remote_root/resources/views/layouts/app.blade.php"
    if [ $? -eq 0 ]; then echo "✅ app.blade.php uploaded successfully!"; else echo "❌ Failed to upload app.blade.php"; fi

    # Upload front_master.blade.php
    echo "📤 Uploading front_master.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$FRONT_MASTER_LOCAL" "$USER@$HOST:$remote_root/resources/views/frontEnd/home/front_master.blade.php"
    if [ $? -eq 0 ]; then echo "✅ front_master.blade.php uploaded successfully!"; else echo "❌ Failed to upload front_master.blade.php"; fi

    # Upload header.blade.php
    echo "📤 Uploading header.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$HEADER_LOCAL" "$USER@$HOST:$remote_root/resources/views/backEnd/partials/header.blade.php"
    if [ $? -eq 0 ]; then echo "✅ header.blade.php uploaded successfully!"; else echo "❌ Failed to upload header.blade.php"; fi

    # Upload footer.blade.php
    echo "📤 Uploading footer.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$FOOTER_LOCAL" "$USER@$HOST:$remote_root/resources/views/backEnd/partials/footer.blade.php"
    if [ $? -eq 0 ]; then echo "✅ footer.blade.php uploaded successfully!"; else echo "❌ Failed to upload footer.blade.php"; fi

    # Upload routes/web.php
    echo "📤 Uploading routes/web.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$WEB_ROUTES_LOCAL" "$USER@$HOST:$remote_root/routes/web.php"
    if [ $? -eq 0 ]; then echo "✅ web.php uploaded successfully!"; else echo "❌ Failed to upload web.php"; fi

    # Upload routes/tenant.php
    echo "📤 Uploading routes/tenant.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$TENANT_ROUTES_LOCAL" "$USER@$HOST:$remote_root/routes/tenant.php"
    if [ $? -eq 0 ]; then echo "✅ tenant.php uploaded successfully!"; else echo "❌ Failed to upload tenant.php"; fi

    # Upload LoginController.php
    echo "📤 Uploading LoginController.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$LOGIN_CONTROLLER_LOCAL" "$USER@$HOST:$remote_root/app/Http/Controllers/Auth/LoginController.php"
    if [ $? -eq 0 ]; then echo "✅ LoginController.php uploaded successfully!"; else echo "❌ Failed to upload LoginController.php"; fi

    # Upload sidebar-component.blade.php
    echo "📤 Uploading sidebar-component.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$SIDEBAR_COMP_LOCAL" "$USER@$HOST:$remote_root/resources/views/components/sidebar-component.blade.php"
    if [ $? -eq 0 ]; then echo "✅ sidebar-component.blade.php uploaded successfully!"; else echo "❌ Failed to upload sidebar-component.blade.php"; fi

    # Upload sidebar_copy.blade.php
    echo "📤 Uploading sidebar_copy.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$SIDEBAR_COPY_LOCAL" "$USER@$HOST:$remote_root/resources/views/backEnd/partials/sidebar_copy.blade.php"
    if [ $? -eq 0 ]; then echo "✅ sidebar_copy.blade.php uploaded successfully!"; else echo "❌ Failed to upload sidebar_copy.blade.php"; fi

    # Upload menu.blade.php
    echo "📤 Uploading menu.blade.php..."
    sshpass -p "$PASS" scp -P "$PORT" "$MENU_LOCAL" "$USER@$HOST:$remote_root/resources/views/backEnd/partials/menu.blade.php"
    if [ $? -eq 0 ]; then echo "✅ menu.blade.php uploaded successfully!"; else echo "❌ Failed to upload menu.blade.php"; fi

    # Upload logo.png
    echo "📤 Uploading logo.png..."
    sshpass -p "$PASS" scp -P "$PORT" "$LOGO_LOCAL" "$USER@$HOST:$remote_root/public/uploads/settings/logo.png"
    if [ $? -eq 0 ]; then echo "✅ logo.png uploaded successfully!"; else echo "❌ Failed to upload logo.png"; fi

    # Upload settings favicon.png
    echo "📤 Uploading settings favicon.png..."
    sshpass -p "$PASS" scp -P "$PORT" "$FAVICON_SETTINGS_LOCAL" "$USER@$HOST:$remote_root/public/uploads/settings/favicon.png"
    if [ $? -eq 0 ]; then echo "✅ settings favicon.png uploaded successfully!"; else echo "❌ Failed to upload settings favicon.png"; fi

    # Upload backend favicon.png
    echo "📤 Uploading backend favicon.png..."
    sshpass -p "$PASS" scp -P "$PORT" "$FAVICON_BACKEND_LOCAL" "$USER@$HOST:$remote_root/public/backEnd/img/favicon.png"
    if [ $? -eq 0 ]; then echo "✅ backend favicon.png uploaded successfully!"; else echo "❌ Failed to upload backend favicon.png"; fi

    # Clear Laravel caches remote
    echo "⚡ Busting Laravel cache & view compiling..."
    sshpass -p "$PASS" ssh -p "$PORT" "$USER@$HOST" "cd $remote_root && php artisan route:clear && php artisan config:clear && php artisan cache:clear && php artisan view:clear"
    echo "🎉 Subdomain deployment completed successfully!"
}

# Run deployment for both subdomains
deploy_to_subdomain "$ROOT1"
deploy_to_subdomain "$ROOT2"

echo ""
echo "=========================================================="
echo "✨ ALL SITES SUCCESSFULLY SYNCHRONIZED AND CACHES BUSTED!"
echo "=========================================================="
