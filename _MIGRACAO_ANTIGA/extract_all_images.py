import zipfile
import os
import shutil

msapp_path = r"c:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\SAVe - Sistema de Avaliação de Vitimização Eletrônico.msapp"
output_dir = r"c:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\SAVe_New\frontend\public\extracted_images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

try:
    with zipfile.ZipFile(msapp_path, 'r') as z:
        count = 0
        for file_info in z.infolist():
            if file_info.filename.startswith("Assets/Images/") and \
               (file_info.filename.lower().endswith('.png') or \
                file_info.filename.lower().endswith('.jpg') or \
                file_info.filename.lower().endswith('.jpeg')):
                
                # Extract to output dir
                original_filename = os.path.basename(file_info.filename)
                target_path = os.path.join(output_dir, original_filename)
                
                with z.open(file_info) as source, open(target_path, "wb") as target:
                    shutil.copyfileobj(source, target)
                
                print(f"Extracted: {original_filename}")
                count += 1

    print(f"\nTotal extracted: {count}")

except Exception as e:
    print(f"Error: {e}")
