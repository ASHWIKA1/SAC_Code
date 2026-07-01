import os
import zipfile

files_to_zip = [
    r"database\migrations\2026_04_14_000001_create_school_extension_custom_tables.php",
    r"app\Http\Controllers\Admin\SchoolExtensionController.php",
    r"routes\admin_school_extensions.php",
    r"resources\views\backEnd\partials\sidebar_copy.blade.php"
]

models = ["SmTransferCertificate.php", "SmMedicalRecord.php", "SmVaccinationRecord.php", "SmBookBank.php", "SmBookBankIssue.php", "SmThirukkural.php", "SmVendor.php", "SmPurchaseOrder.php", "SmVendorPayment.php", "SmHostel.php", "SmHostelRoom.php", "SmHostelAllocation.php", "SmHostelFee.php", "SmHostelMeal.php"]
for m in models:
    files_to_zip.append(os.path.join("app", "Models", m))

# Add all blade files in specific viewing directories
view_dirs = [
    r"resources\views\backEnd\tc",
    r"resources\views\backEnd\medical",
    r"resources\views\backEnd\bookBank",
    r"resources\views\backEnd\vendor",
    r"resources\views\backEnd\hostel"
]

for vd in view_dirs:
    for root, dirs, files in os.walk(vd):
        for f in files:
            files_to_zip.append(os.path.join(root, f))

zip_name = "extension_modules_update.zip"

print(f"Creating {zip_name} with preserved paths...")
with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
    for file_path in files_to_zip:
        if os.path.exists(file_path):
            zf.write(file_path, arcname=file_path)
            print(f"Added {file_path}")
        else:
            print(f"Warning: {file_path} does not exist!")

print("Done creating zip.")
