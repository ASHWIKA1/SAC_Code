import re

with open('routes/admin_school_extensions.php', 'r') as f:
    routes = f.read()

# Fix routes file
routes = routes.replace("'vendor-dashboard', 'dashboard'", "'vendor-dashboard', 'vendorDashboard'")
routes = routes.replace("'hostel-dashboard', 'dashboard'", "'hostel-dashboard', 'hostelDashboard'")
routes = routes.replace("'canteen-dashboard', 'dashboard'", "'canteen-dashboard', 'canteenDashboard'")

with open('routes/admin_school_extensions.php', 'w') as f:
    f.write(routes)


with open('app/Http/Controllers/Admin/SchoolExtensionController.php', 'r') as f:
    controller = f.read()

# Fix Vendor dashboard
vendor_idx = controller.find('// VENDOR MANAGEMENT (New)')
hostel_idx = controller.find('// HOSTEL MANAGEMENT (New)')
canteen_idx = controller.find('// CANTEEN MANAGEMENT (New)')

vendor_part = controller[vendor_idx:hostel_idx].replace('public function dashboard()', 'public function vendorDashboard()')
hostel_part = controller[hostel_idx:canteen_idx].replace('public function dashboard()', 'public function hostelDashboard()')
canteen_part = controller[canteen_idx:].replace('public function dashboard()', 'public function canteenDashboard()')

controller = controller[:vendor_idx] + vendor_part + hostel_part + canteen_part

with open('app/Http/Controllers/Admin/SchoolExtensionController.php', 'w') as f:
    f.write(controller)

print("Methods renamed!")
