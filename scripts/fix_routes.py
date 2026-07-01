import re

with open('routes/admin_school_extensions.php', 'r') as f:
    content = f.read()

# Remove imports
content = re.sub(r'use App\\Http\\Controllers\\Admin\\HostelExtensionController;\n', '', content)
content = re.sub(r'use App\\Http\\Controllers\\Admin\\VendorExtensionController;\n', '', content)
content = re.sub(r'use App\\Http\\Controllers\\Admin\\CanteenController;\n', '', content)

# Change controller groupings to SchoolExtensionController
content = content.replace('Route::controller(HostelExtensionController::class)->group(function (): void {', 'Route::controller(SchoolExtensionController::class)->group(function (): void {')
content = content.replace('Route::controller(VendorExtensionController::class)->group(function (): void {', 'Route::controller(SchoolExtensionController::class)->group(function (): void {')
content = content.replace('Route::controller(CanteenController::class)->group(function (): void {', 'Route::controller(SchoolExtensionController::class)->group(function (): void {')

with open('routes/admin_school_extensions.php', 'w') as f:
    f.write(content)

print("Routes fixed!")
