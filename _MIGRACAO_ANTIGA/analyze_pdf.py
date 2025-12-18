import sys
import os

pdf_path = r"c:\Users\User\Desktop\Tabelas SAVe\SAVe - Documentação v2 - Acordo.pdf"

def extract_strings(filename, min_len=4):
    with open(filename, errors="ignore") as f:
        result = ""
        for line in f:
            for char in line:
                if char.isprintable():
                    result += char
                else:
                    if len(result) >= min_len:
                        yield result
                    result = ""
            if len(result) >= min_len:
                yield result

try:
    import PyPDF2
    print("Using PyPDF2")
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(text)
except ImportError:
    print("PyPDF2 not found. Trying simple string extraction (low quality).")
    # Simple binary string extraction as fallback
    with open(pdf_path, 'rb') as f:
        content = f.read()
        # Filter for printable sequences
        import string
        printable = set(string.printable.encode('ascii'))
        
        current_string = bytearray()
        found_strings = []
        for byte in content:
            if byte in printable:
                current_string.append(byte)
            else:
                if len(current_string) > 4:
                    try:
                        s = current_string.decode('ascii')
                        found_strings.append(s)
                    except:
                        pass
                current_string = bytearray()
        
        # Print first 2000 chars of strings found
        print('\n'.join(found_strings[:500]))
