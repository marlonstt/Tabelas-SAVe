import zipfile
import json
import os
import re

msapp_path = r"c:/Users/User/Desktop/Tabelas SAVe/SAVe - Sistema de Avaliação de Vitimização Eletrônico.msapp"

def analyze_msapp(file_path):
    print(f"Analyzing {file_path}...")
    
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            # List all files
            file_list = z.namelist()
            
            # Look for Properties.json or similar to find controls and data sources
            # Usually in "Controls" folder or "Entities.json"
            
            # 1. Find Data Sources
            data_sources = []
            if 'References/DataSources.json' in file_list:
                with z.open('References/DataSources.json') as f:
                    ds_data = json.load(f)
                    for ds in ds_data.get('DataSources', []):
                        data_sources.append(ds.get('Name'))
            
            print("Data Sources Found:", data_sources)
            
            # 2. Analyze usage of "ID" and columns
            # We need to scan the formulas in the controls.
            # Controls are usually in "Controls/1.json", "Controls/2.json" etc. or similar structure depending on version.
            # Or sometimes in "Screen1.json" etc inside a folder.
            
            # Let's look for json files in Controls/
            control_files = [f for f in file_list if f.startswith('Controls/') and f.endswith('.json')]
            
            id_usage = {}
            column_usage = {}
            
            for cf in control_files:
                with z.open(cf) as f:
                    try:
                        data = json.load(f)
                        # Recursive search for rules/formulas
                        def search_formulas(obj):
                            if isinstance(obj, dict):
                                for k, v in obj.items():
                                    if k == 'InvariantScript' or k == 'Script':
                                        # This is a formula. Search for .ID or !ID
                                        # Regex for .ID usage (case insensitive mostly in PA but let's check)
                                        # PowerApps uses .ID usually.
                                        
                                        # Check for ID usage
                                        if re.search(r'\.ID\b', v, re.IGNORECASE):
                                            id_usage[cf] = id_usage.get(cf, 0) + 1
                                            
                                    search_formulas(v)
                            elif isinstance(obj, list):
                                for item in obj:
                                    search_formulas(item)
                                    
                        search_formulas(data)
                    except Exception as e:
                        print(f"Error parsing {cf}: {e}")


            with open('analysis_results.txt', 'w', encoding='utf-8') as out_f:
                out_f.write(f"Data Sources Found: {data_sources}\n")
                
                # Analyze Galleries to find 1:N relationships
                # If a table is used in a Gallery, it's likely 1:N or N:N
                gallery_sources = {}
                
                for cf in control_files:
                    with z.open(cf) as f:
                        try:
                            data = json.load(f)
                            def search_galleries(obj):
                                if isinstance(obj, dict):
                                    if obj.get('Template') and 'Gallery' in obj.get('Template', {}).get('Id', ''):
                                        # This is a gallery
                                        # Look for Items property
                                        for rule in obj.get('Rules', []):
                                            if rule.get('Property') == 'Items':
                                                script = rule.get('InvariantScript', '')
                                                # Check which data source is used
                                                for ds in data_sources:
                                                    if ds in script:
                                                        gallery_sources[ds] = gallery_sources.get(ds, 0) + 1
                                    # Recursively search children and other dict/list values
                                    if 'Children' in obj:
                                        search_galleries(obj.get('Children'))
                                    for k, v in obj.items():
                                         if isinstance(v, (dict, list)) and k != 'Children': # Avoid double processing 'Children'
                                             search_galleries(v)
                                elif isinstance(obj, list):
                                    for item in obj:
                                        search_galleries(item)
                            
                            search_galleries(data)
                        except:
                            pass
                
                out_f.write("\nPotential 1:N Tables (Used in Galleries):\n")
                for ds, count in gallery_sources.items():
                    out_f.write(f"  {ds}: {count} galleries\n")
                
                out_f.write("\nID Usage Summary (Count of .ID references per control file):\n")
                for cf, count in id_usage.items():
                    out_f.write(f"  {cf}: {count}\n")
                    
                # Check for ID_Caso usage
                out_f.write("\nID_Caso Usage Check:\n")
                id_caso_found = False
                for cf in control_files:
                     with z.open(cf) as f:
                        content = f.read().decode('utf-8', errors='ignore')
                        if 'ID_Caso' in content:
                            out_f.write(f"  Found ID_Caso in {cf}\n")
                            id_caso_found = True
                            break
                if not id_caso_found:
                    out_f.write("  ID_Caso NOT found in controls.\n")
        
                if not control_files:
                     # Try searching in Properties.json or similar if structure is different
                     pass

    except Exception as e:
        print(f"Error opening MSAPP: {e}")

if __name__ == "__main__":
    analyze_msapp(msapp_path)
