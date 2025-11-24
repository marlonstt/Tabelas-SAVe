import re
import os

# Path to the PowerShell script
ps_script_path = r"c:/Users/User/Desktop/Tabelas SAVe/SAVe_ScriptTodasListas3.ps1"
output_sql_path = r"c:/Users/User/Desktop/Tabelas SAVe/tables.sql"
output_readme_path = r"c:/Users/User/Desktop/Tabelas SAVe/README.txt"

def parse_ps_script(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lists = []
    
    # Regex to find list definitions
    # Looking for Title = "..." and then Columns = @( ... )
    
    # We'll split the content by "Title =" to find chunks, then parse each chunk
    # This is a bit rough but should work for the structured file
    
    # Better approach: Find all blocks that look like a list definition
    # The pattern seems to be:
    # [PSCustomObject]@{
    #         Title   = "SAVe_Geral"
    #         Url     = "Listas/SAVe_Geral"
    #         Columns = @(
    #             ...
    #         )
    #     },
    
    # Let's iterate through the file line by line to be safer
    
    current_list = None
    in_columns = False
    
    lines = content.splitlines()
    for line in lines:
        line = line.strip()
        
        # Start of a new list object (roughly)
        if 'Title   =' in line or 'Title =' in line:
            match = re.search(r'Title\s*=\s*"([^"]+)"', line)
            if match:
                if current_list:
                    lists.append(current_list)
                current_list = {
                    'name': match.group(1),
                    'columns': []
                }
                in_columns = False
                
        if 'Columns = @(' in line:
            in_columns = True
            continue
            
        if in_columns and line.startswith(')'):
            in_columns = False
            continue
            
        if in_columns and '[PSCustomObject]@{' in line:
            # Parse column line
            # [PSCustomObject]@{ DisplayName="ID_Caso"; InternalName="ID_Caso"; Type="Number" },
            col_match = re.search(r'DisplayName="([^"]+)";\s*InternalName="([^"]+)";\s*Type="([^"]+)"', line)
            if col_match:
                col_data = {
                    'DisplayName': col_match.group(1),
                    'InternalName': col_match.group(2),
                    'Type': col_match.group(3),
                    'Options': {}
                }
                
                # Check for Options
                if 'Options=@{' in line:
                    options_part = line.split('Options=@{')[1].split('}')[0]
                    # Parse options like LookupList="SAVe_Responsaveis"; LookupField="Nome"; AllowMultipleValues = $true
                    # Simple split by ;
                    opts = options_part.split(';')
                    for opt in opts:
                        if '=' in opt:
                            k, v = opt.split('=', 1)
                            col_data['Options'][k.strip()] = v.strip().replace('"', '')
                            
                current_list['columns'].append(col_data)

    if current_list:
        lists.append(current_list)
        
    return lists

def generate_sql(lists):
    sql_lines = []
    
    # Tables that MUST have "ID" as Primary Key (1:N relationships or specific user request)
    tables_with_id_pk = [
        "SAVe_Acompanhamentos",
        "SAVe_Logs_Acesso",
        "SAVe_Responsaveis",
        "SAVe_Perfil_Agressor",
        "SAVe_protecao_seguranca_ameacadores",
        "SAVe_Vinculos_Apoio",
        "SAVe_protecao_seguranca_adolescente",
        "SAVe_Situacao_Juridica_Incluir_processo",
        "SAVe_Identificacao_email",
        "SAVe_Identificacao_telefone",
        "SAVe_Perfil_Agressor_Endereco", # Assuming 1:N based on safety
        "SAVe_Casos_Vinculados", # Likely 1:N
        "SAVe_Usuarios" # No ID_Caso here usually
    ]
    
    for lst in lists:
        table_name = lst['name']
        sql_lines.append(f'-- Table: {table_name}')
        sql_lines.append(f'CREATE TABLE "{table_name}" (')
        
        # Determine Primary Key strategy
        if table_name in tables_with_id_pk:
            # 1:N Table: Needs explicit ID PK
            sql_lines.append(f'    "ID" SERIAL PRIMARY KEY,')
            # ID_Caso will be added as a normal column by the loop below if it exists in the PS script
        else:
            # 1:1 Table: ID_Caso is the PK
            # We need to ensure ID_Caso is defined as PK when we encounter it in the loop
            # OR we explicitly add it here if we want to force it first.
            # Let's check if ID_Caso exists in columns to define it as PK there.
            pass
        
        junction_tables = []
        
        # Check if ID_Caso is in the columns for this list
        has_id_caso = any(col['InternalName'] == 'ID_Caso' for col in lst['columns'])
        
        for col in lst['columns']:
            col_name = col['InternalName']
            col_type = col['Type']
            sql_type = "TEXT"
            
            if col_type == "Number":
                sql_type = "INTEGER"
            elif col_type == "DateTime":
                sql_type = "TIMESTAMP"
            elif col_type == "Boolean":
                sql_type = "BOOLEAN"
            elif col_type == "Note":
                sql_type = "TEXT"
            elif col_type == "User":
                sql_type = "TEXT"
            elif col_type == "Lookup":
                # Check if multi-value
                allow_multiple = col['Options'].get('AllowMultipleValues', '$false')
                lookup_list = col['Options'].get('LookupList')
                
                if allow_multiple == '$true':
                    # SIMPLIFICATION: For SAVe_Acompanhamentos.Responsaveis, use TEXT.
                    # This makes migration and PowerApps integration much easier than a junction table.
                    if table_name == "SAVe_Acompanhamentos" and col_name == "Responsaveis":
                        sql_type = "TEXT"
                    else:
                        # Create junction table later
                        junction_table_name = f"{table_name}_{col_name}_Link"
                        junction_tables.append({
                            'name': junction_table_name,
                            'col_name': col_name,
                            'lookup_list': lookup_list
                        })
                        continue # Skip adding column to main table
                else:
                    sql_type = "INTEGER" # FK ID
            
            # Special handling for ID_Caso in 1:1 tables
            if col_name == "ID_Caso" and table_name not in tables_with_id_pk:
                sql_lines.append(f'    "{col_name}" INTEGER PRIMARY KEY,')
            else:
                sql_lines.append(f'    "{col_name}" {sql_type},')
            
        # Remove trailing comma from last column
        if sql_lines[-1].endswith(','):
            sql_lines[-1] = sql_lines[-1][:-1]
            
        sql_lines.append(');')
        sql_lines.append('')
        
        # Create junction tables
        for jt in junction_tables:
            sql_lines.append(f'-- Junction Table for {table_name}.{jt["col_name"]}')
            sql_lines.append(f'CREATE TABLE "{jt["name"]}" (')
            
            # Reference depends on the PK of the source table
            if table_name in tables_with_id_pk:
                 sql_lines.append(f'    "{table_name}_ID" INTEGER REFERENCES "{table_name}"("ID"),')
            else:
                 # If 1:1, the PK is ID_Caso
                 sql_lines.append(f'    "{table_name}_ID" INTEGER REFERENCES "{table_name}"("ID_Caso"),')

            if jt['lookup_list']:
                 # We assume target lookup list has "ID" as PK? 
                 # Usually lookup targets are "Master" lists like Responsaveis, which are in our ID_PK list.
                 # But if it references a 1:1 table, it should reference ID_Caso.
                 # For safety, let's assume "ID" for now as most lookups target master lists.
                 # If SAVe_Responsaveis is the target, it has ID.
                 sql_lines.append(f'    "{jt["lookup_list"]}_ID" INTEGER REFERENCES "{jt["lookup_list"]}"("ID"),')
            else:
                 sql_lines.append(f'    "Lookup_ID" INTEGER,')
                 
            sql_lines.append(f'    PRIMARY KEY ("{table_name}_ID", "{jt["lookup_list"]}_ID")')
            sql_lines.append(');')
            sql_lines.append('')

    return "\n".join(sql_lines)

def generate_readme(lists):
    lines = []
    lines.append("Documentation of PostgreSQL Tables converted from SharePoint Lists")
    lines.append("=================================================================")
    lines.append("")
    
    for lst in lists:
        lines.append(f"Table: {lst['name']}")
        lines.append("-" * (len(lst['name']) + 7))
        for col in lst['columns']:
            lines.append(f"  - {col['InternalName']} ({col['Type']})")
        lines.append("")
        
    return "\n".join(lines)

def main():
    lists = parse_ps_script(ps_script_path)
    
    sql_content = generate_sql(lists)
    with open(output_sql_path, 'w', encoding='utf-8') as f:
        f.write(sql_content)
        
    readme_content = generate_readme(lists)
    with open(output_readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
        
    print(f"Generated {output_sql_path}")
    print(f"Generated {output_readme_path}")

if __name__ == "__main__":
    main()
