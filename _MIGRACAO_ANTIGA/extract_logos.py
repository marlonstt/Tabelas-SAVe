import zipfile
import os
import shutil

msapp_path = r"c:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\SAVe - Sistema de Avaliação de Vitimização Eletrônico.msapp"
output_dir = r"c:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\SAVe_New\frontend\public"

# Keywords to search for
keywords = ["logo", "save", "mp", "01"]

found_files = []

try:
    with zipfile.ZipFile(msapp_path, 'r') as z:
        # List all files in the zip
        for file_info in z.infolist():
            # Check if it's an image and matches keywords
            if any(k in file_info.filename.lower() for k in keywords) and \
               (file_info.filename.lower().endswith('.png') or \
                file_info.filename.lower().endswith('.jpg') or \
                file_info.filename.lower().endswith('.jpeg') or \
                file_info.filename.lower().endswith('.svg')):
                
                print(f"Found potential match: {file_info.filename}")
                
                # Extract to output dir
                # We'll rename them to avoid slashes in filenames if they are in subfolders
                original_filename = os.path.basename(file_info.filename)
                target_path = os.path.join(output_dir, original_filename)
                
                with z.open(file_info) as source, open(target_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                
                found_files.append(original_filename)

    print(f"\nExtracted {len(found_files)} files to {output_dir}:")
    for f in found_files:
        print(f"- {f}")

except Exception as e:
    print(f"Error: {e}")
