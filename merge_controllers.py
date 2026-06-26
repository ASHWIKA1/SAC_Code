import re

def extract_methods(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract everything between 'class ControllerName extends Controller {' and the last '}'
    match = re.search(r'class \w+ extends Controller\s*\{([\s\S]*)\}\s*$', content)
    if not match:
        return ""
    
    methods = match.group(1)
    # Remove the private function schoolId() as it's already in SchoolExtensionController
    methods = re.sub(r'private function schoolId\(\)\s*\{[\s\S]*?\}', '', methods, count=1)
    
    return methods.strip()

def extract_imports(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    imports = re.findall(r'^use [^;]+;$', content, re.MULTILINE)
    return imports

# Extract methods
canteen_methods = extract_methods('app/Http/Controllers/Admin/CanteenController.php')
hostel_methods = extract_methods('app/Http/Controllers/Admin/HostelExtensionController.php')
vendor_methods = extract_methods('app/Http/Controllers/Admin/VendorExtensionController.php')

# Extract imports
all_imports = set()
all_imports.update(extract_imports('app/Http/Controllers/Admin/CanteenController.php'))
all_imports.update(extract_imports('app/Http/Controllers/Admin/HostelExtensionController.php'))
all_imports.update(extract_imports('app/Http/Controllers/Admin/VendorExtensionController.php'))

# Read existing SchoolExtensionController
with open('app/Http/Controllers/Admin/SchoolExtensionController.php', 'r') as f:
    school_content = f.read()

# Remove methods that are being replaced (we'll just append our new methods and assume the new ones take precedence if we rename them or we just append for now. Wait, SchoolExtensionController already has hostelList etc.)
# Let's completely remove the existing Hostel and Vendor sections from SchoolExtensionController!

# Hostel section starts around line 640 "// 5. Hostel Management"
# We can just cut the file there.
hostel_index = school_content.find('// ==========================================')
if hostel_index != -1:
    # Find the vendor section
    vendor_index = school_content.find('// 4. Vendor Management')
    hostel_index = school_content.find('// 5. Hostel Management')

# Actually, let's just replace the whole Vendor and Hostel sections.
# We will use regex to find '// 4. Vendor Management' up to the end of the class.
match = re.search(r'// ==========================================\s*// 4\. Vendor Management[\s\S]*$', school_content)
if match:
    school_content = school_content[:match.start()]

# Remove the last closing brace
school_content = school_content.rstrip()
if school_content.endswith('}'):
    school_content = school_content[:-1]

# Now let's inject missing imports
# Find the last 'use ' line
last_use_match = list(re.finditer(r'^use [^;]+;$', school_content, re.MULTILINE))[-1]
last_use_end = last_use_match.end()

existing_imports = set(m.group(0) for m in re.finditer(r'^use [^;]+;$', school_content, re.MULTILINE))
new_imports = all_imports - existing_imports

imports_str = "\n".join(new_imports)

if imports_str:
    school_content = school_content[:last_use_end] + "\n" + imports_str + school_content[last_use_end:]

# Assemble new content
new_content = school_content + "\n\n    // ==========================================\n    // VENDOR MANAGEMENT (New)\n    // ==========================================\n" + vendor_methods + "\n\n    // ==========================================\n    // HOSTEL MANAGEMENT (New)\n    // ==========================================\n" + hostel_methods + "\n\n    // ==========================================\n    // CANTEEN MANAGEMENT (New)\n    // ==========================================\n" + canteen_methods + "\n}\n"

with open('app/Http/Controllers/Admin/SchoolExtensionController.php', 'w') as f:
    f.write(new_content)

print("Merged successfully!")
