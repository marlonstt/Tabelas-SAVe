import zipfile
import os

msapp_path = r"c:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\SAVe - Sistema de Avaliação de Vitimização Eletrônico.msapp"

try:
    with zipfile.ZipFile(msapp_path, 'r') as z:
        print("Listing files in Assets/Images folder:")
        for file_info in z.infolist():
            if "Assets" in file_info.filename or "Images" in file_info.filename:
                print(f"- {file_info.filename}")
            # Also print root files just in case
            if "/" not in file_info.filename:
                 print(f"- {file_info.filename}")

except Exception as e:
    print(f"Error: {e}")
