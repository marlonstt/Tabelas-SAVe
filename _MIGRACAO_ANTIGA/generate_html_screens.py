import os

OUTPUT_DIR = r"C:\Users\User\Desktop\SAVe_Svelt e GoLang\Tabelas SAVe\HTML_Screens"

# Common styles
STYLE = """
<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f5f6f8;
        margin: 0;
        padding: 20px;
        color: #333;
    }
    .screen-container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 20px;
        min-height: 80vh;
    }
    h1 {
        color: #3860b2;
        border-bottom: 2px solid #3860b2;
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 24px;
    }
    h2 {
        color: #3860b2;
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
    }
    .form-group {
        margin-bottom: 15px;
    }
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #444;
    }
    input[type="text"],
    input[type="email"],
    input[type="date"],
    input[type="number"],
    select,
    textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 14px;
    }
    input[type="checkbox"],
    input[type="radio"] {
        margin-right: 8px;
    }
    .checkbox-group, .radio-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .checkbox-item, .radio-item {
        display: flex;
        align-items: center;
    }
    button {
        background-color: #3860b2;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }
    button:hover {
        background-color: #2a4a8b;
    }
    .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    .grid-3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
    }
    .section {
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }
    .gallery {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        background-color: #fafafa;
        margin-top: 10px;
    }
    .gallery-item {
        background: white;
        border: 1px solid #eee;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
    }
    .nav-bar {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
</style>
"""

# Screen Definitions
SCREENS = {
    "Tela_Login": {
        "title": "Login - SAVe",
        "content": [
            {"type": "section", "title": "Autenticação", "fields": [
                {"label": "Usuário/Email", "type": "text", "id": "login_email"},
                {"label": "Senha", "type": "password", "id": "login_password"},
                {"label": "Entrar", "type": "button", "action": "window.location.href='Tela_Entrada.html'"}
            ]}
        ]
    },
    "Tela_Entrada": {
        "title": "Menu Principal - SAVe",
        "content": [
            {"type": "section", "title": "Bem-vindo ao aplicativo SAVe", "fields": [
                {"type": "placeholder", "text": "O que deseja fazer a seguir?", "style": "font-size: 18px; margin-bottom: 20px; text-align: center; border: none; background: transparent;"},
                {"label": "Acessar Casos", "type": "button", "action": "window.location.href='Tela_Buscar_Casos.html'", "style": "width: 100%; margin-bottom: 10px;"},
                {"label": "Criar Novo Caso", "type": "button", "action": "window.location.href='Tela_Selecao_Form.html'", "style": "width: 100%; margin-bottom: 10px;"},
                {"label": "Gestão de Usuários (Admin)", "type": "button", "action": "window.location.href='Tela_Gestao_Usuarios.html'", "style": "width: 100%; margin-bottom: 10px; background-color: #555;"},
                {"label": "Dashboards (Admin)", "type": "button", "action": "window.location.href='Tela_Dashboards.html'", "style": "width: 100%; margin-bottom: 10px; background-color: #555;"}
            ]}
        ]
    },
    "Tela_Selecao_Form": {
        "title": "Seleção de Formulário",
        "content": [
            {"type": "section", "title": "Selecione o tipo de versão desejada:", "fields": [
                {"label": "Versão Breve", "type": "button", "action": "window.location.href='Tela_Dados_Entrada.html?versao=breve'", "style": "width: 100%; margin-bottom: 10px; height: 60px; font-size: 18px;"},
                {"label": "Versão Completa", "type": "button", "action": "window.location.href='Tela_Dados_Entrada.html?versao=completa'", "style": "width: 100%; margin-bottom: 10px; height: 60px; font-size: 18px;"},
                {"label": "Cancelar", "type": "button", "action": "window.location.href='Tela_Entrada.html'", "style": "width: 100%; background-color: #999;"}
            ]}
        ]
    },
    "Tela_Dados_Entrada": {
        "title": "Dados de Entrada",
        "content": [
            {"type": "section", "title": "Informações Básicas", "fields": [
                {"label": "Data", "type": "date", "id": "data_entrada"},
                {"label": "Comarca de Origem", "type": "select", "id": "comarca", "options": ["BELO HORIZONTE", "CONTAGEM", "BETIM", "UBERLANDIA", "JUIZ DE FORA", "MONTES CLAROS", "OUTROS"]},
                {"label": "Nº do Procedimento / Sistema MPE", "type": "text", "id": "num_procedimento"},
                {"label": "Precisa de atendimento especial?", "type": "radio", "id": "atendimento_especial", "options": ["Sim", "Não"]},
                {"label": "Qual tipo de atendimento?", "type": "text", "id": "tipo_atendimento_especial", "condition": "atendimento_especial == 'Sim'"}
            ]},
            {"type": "section", "title": "Quem Encaminha", "fields": [
                {"label": "Quem encaminha", "type": "select", "id": "quem_encaminha", "options": ["MPMG", "Polícia Civil", "Polícia Militar", "DPMG", "Outros"]},
                {"label": "Nome do Profissional", "type": "text", "id": "pe_nome"},
                {"label": "Telefone", "type": "text", "id": "pe_telefone"},
                {"label": "E-mail", "type": "email", "id": "pe_email"},
                {"label": "Cargo/Função", "type": "text", "id": "pe_cargo"}
            ]},
            {"type": "section", "title": "Casos Relacionados", "fields": [
                {"label": "Possui relação com outro caso?", "type": "radio", "id": "possui_relacao", "options": ["Sim", "Não"]},
                {"type": "gallery", "title": "Casos Vinculados", "id": "galeria_casos_vinculados", "columns": ["ID Caso", "Nome Vítima"]}
            ]}
        ]
    },
    "Tela_Socio_Identificacao": {
        "title": "Identificação Socioeconômica",
        "content": [
            {"type": "section", "title": "Dados Pessoais", "fields": [
                {"label": "Nome Civil", "type": "text", "id": "nome_civil"},
                {"label": "Nome Social", "type": "text", "id": "nome_social"},
                {"label": "Data de Nascimento", "type": "date", "id": "data_nascimento"},
                {"label": "Idade", "type": "number", "id": "idade", "readonly": True},
                {"label": "Nome da Mãe", "type": "text", "id": "nome_mae"},
                {"label": "Nome do Pai", "type": "text", "id": "nome_pai"}
            ]},
            {"type": "section", "title": "Documentação", "fields": [
                {"label": "CPF", "type": "text", "id": "cpf"},
                {"label": "RG", "type": "text", "id": "rg"},
                {"label": "CTPS", "type": "text", "id": "ctps"}
            ]},
            {"type": "section", "title": "Perfil", "fields": [
                {"label": "Sexo", "type": "select", "id": "sexo", "options": ["Masculino", "Feminino", "Intersexo"]},
                {"label": "Identidade de Gênero", "type": "select", "id": "identidade_genero", "options": ["Cisgênero", "Transgênero", "Não-binário", "Outros"]},
                {"label": "Orientação Sexual", "type": "select", "id": "orientacao_sexual", "options": ["Heterossexual", "Homossexual", "Bissexual", "Outros"]},
                {"label": "Raça/Cor", "type": "select", "id": "raca_cor", "options": ["Branca", "Preta", "Parda", "Amarela", "Indígena"]},
                {"label": "Estado Civil", "type": "select", "id": "estado_civil", "options": ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"]}
            ]},
             {"type": "section", "title": "Contatos", "fields": [
                {"type": "gallery", "title": "Telefones", "id": "galeria_telefones", "columns": ["Número", "Tipo"]},
                {"type": "gallery", "title": "E-mails", "id": "galeria_emails", "columns": ["Endereço"]},
                {"label": "Endereço Completo", "type": "textarea", "id": "endereco_completo"}
            ]}
        ]
    },
    "Tela_SitJuridica": {
        "title": "Situação Jurídica",
        "content": [
            {"type": "section", "title": "Dados do Processo", "fields": [
                {"label": "REDS", "type": "text", "id": "reds"},
                {"label": "PCNet", "type": "text", "id": "pcnet"},
                {"label": "Medidas Protetivas?", "type": "radio", "id": "medidas_protetivas", "options": ["Sim", "Não"]},
                {"label": "Houve descumprimento?", "type": "radio", "id": "descumprimento", "options": ["Sim", "Não"]}
            ]},
            {"type": "section", "title": "Fases do Processo", "fields": [
                {"label": "Data do Fato", "type": "date", "id": "data_fato"},
                {"label": "Data da Denúncia", "type": "date", "id": "data_denuncia"},
                {"label": "Data da Sentença", "type": "date", "id": "data_sentenca"}
            ]},
            {"type": "section", "title": "Demandas da Vítima", "fields": [
                {"label": "Demandas Jurídicas", "type": "checkbox_group", "id": "demandas_juridicas", "options": [
                    "Acompanhamento processual",
                    "Orientação jurídica",
                    "Medida protetiva",
                    "Reparação de danos"
                ]}
            ]}
        ]
    },
     "Tela_Saude": {
        "title": "Saúde",
        "content": [
            {"type": "section", "title": "Condições de Saúde", "fields": [
                {"label": "Pessoa com Deficiência?", "type": "radio", "id": "pcd", "options": ["Sim", "Não"]},
                {"label": "Qual deficiência?", "type": "text", "id": "tipo_deficiencia", "condition": "pcd == 'Sim'"},
                {"label": "Uso de medicação contínua?", "type": "radio", "id": "medicacao", "options": ["Sim", "Não"]},
                {"label": "Acompanhamento psicológico?", "type": "radio", "id": "psicologico", "options": ["Sim", "Não"]}
            ]},
            {"type": "section", "title": "Impactos da Violência", "fields": [
                {"label": "Impactos na saúde física", "type": "textarea", "id": "impactos_fisicos"},
                {"label": "Impactos na saúde mental", "type": "textarea", "id": "impactos_mentais"}
            ]}
        ]
    },
    "Tela_Territorio": {
        "title": "Habitação e Território",
        "content": [
            {"type": "section", "title": "Moradia", "fields": [
                {"label": "Tipo de Moradia", "type": "select", "id": "tipo_moradia", "options": ["Própria", "Alugada", "Cedida", "Ocupação", "Situação de Rua"]},
                {"label": "Estrutura da Moradia", "type": "text", "id": "estrutura_moradia"},
                {"label": "Risco Geológico?", "type": "radio", "id": "risco_geologico", "options": ["Sim", "Não"]}
            ]},
            {"type": "section", "title": "Território", "fields": [
                {"label": "Fatores de Risco no Território", "type": "checkbox_group", "id": "fatores_risco_territorio", "options": [
                    "Criminalidade elevada",
                    "Ausência de serviços públicos",
                    "Conflitos fundiários",
                    "Isolamento geográfico"
                ]}
            ]}
        ]
    },
    "Tela_Assistencia": {
        "title": "Assistência Social",
        "content": [
            {"type": "section", "title": "Rede de Assistência", "fields": [
                {"label": "Possui Cadastro Único?", "type": "radio", "id": "cad_unico", "options": ["Sim", "Não"]},
                {"label": "Acompanhado pelo CRAS?", "type": "radio", "id": "cras", "options": ["Sim", "Não"]},
                {"label": "Acompanhado pelo CREAS?", "type": "radio", "id": "creas", "options": ["Sim", "Não"]}
            ]},
            {"type": "section", "title": "Benefícios", "fields": [
                {"label": "Recebe Benefícios?", "type": "checkbox_group", "id": "beneficios", "options": [
                    "Bolsa Família",
                    "BPC",
                    "Auxílio Gás",
                    "Outros"
                ]}
            ]}
        ]
    },
    "Tela_Ensino_Trab_Renda": {
        "title": "Ensino, Trabalho e Renda",
        "content": [
            {"type": "section", "title": "Educação", "fields": [
                {"label": "Escolaridade", "type": "select", "id": "escolaridade", "options": ["Fundamental Incompleto", "Fundamental Completo", "Médio Incompleto", "Médio Completo", "Superior Incompleto", "Superior Completo"]},
                {"label": "Estuda atualmente?", "type": "radio", "id": "estuda_atualmente", "options": ["Sim", "Não"]}
            ]},
            {"type": "section", "title": "Trabalho e Renda", "fields": [
                {"label": "Situação de Trabalho", "type": "select", "id": "situacao_trabalho", "options": ["Empregado (CLT)", "Autônomo", "Desempregado", "Aposentado", "Informal"]},
                {"label": "Renda Mensal Individual", "type": "number", "id": "renda_individual"},
                {"label": "Prejuízos no trabalho devido à violência?", "type": "textarea", "id": "prejuizos_trabalho"}
            ]}
        ]
    },
    "Tela_Vinculos": {
        "title": "Vínculos Familiares",
        "content": [
            {"type": "section", "title": "Composição Familiar", "fields": [
                {"label": "Quantidade de pessoas na casa", "type": "number", "id": "qtd_pessoas"},
                {"label": "Quantidade de filhos", "type": "number", "id": "qtd_filhos"},
                {"label": "Renda Familiar Total", "type": "number", "id": "renda_familiar"}
            ]},
            {"type": "section", "title": "Membros da Família", "fields": [
                {"type": "gallery", "title": "Lista de Familiares", "id": "galeria_familiares", "columns": ["Nome", "Parentesco", "Idade"]}
            ]}
        ]
    },
    "Tela_Protecao_Seguranca": {
        "title": "Proteção e Segurança",
        "content": [
            {"type": "section", "title": "Ameaça", "fields": [
                {"label": "Natureza da Ameaça", "type": "text", "id": "natureza_ameaca"},
                {"label": "Meio utilizado", "type": "select", "id": "meio_ameaca", "options": ["Presencial", "Telefone", "Redes Sociais", "Terceiros"]},
                {"label": "Possui arma de fogo?", "type": "radio", "id": "arma_fogo", "options": ["Sim", "Não", "Não sei"]}
            ]},
            {"type": "section", "title": "Medidas de Proteção", "fields": [
                {"label": "Inserido em programa de proteção?", "type": "radio", "id": "programa_protecao", "options": ["Sim", "Não"]},
                {"label": "Estratégias de segurança adotadas", "type": "textarea", "id": "estrategias_seguranca"}
            ]}
        ]
    },
    "Tela_Agressor": {
        "title": "Perfil do Agressor",
        "content": [
            {"type": "section", "title": "Identificação do Agressor", "fields": [
                {"label": "Tipo", "type": "radio", "id": "tipo_agressor", "options": ["Pessoa Física", "Pessoa Jurídica"]},
                {"label": "Nome/Razão Social", "type": "text", "id": "nome_agressor"},
                {"label": "Vínculo com a vítima", "type": "text", "id": "vinculo_vitima"},
                {"label": "Endereço", "type": "text", "id": "endereco_agressor"}
            ]},
            {"type": "gallery", "title": "Lista de Agressores", "id": "galeria_agressores", "columns": ["Nome", "Tipo", "Vínculo"]}
        ]
    },
    "Tela_Vitimizacao": {
        "title": "Vitimização",
        "content": [
            {"type": "section", "title": "Vitimização Secundária (Institucional)", "fields": [
                {"label": "Ocorrências", "type": "checkbox_group", "id": "vitimizacao_secundaria", "options": [
                    "Depoimento repetitivo",
                    "Falta de informação",
                    "Demora injustificada",
                    "Atendimento inadequado",
                    "Exposição indevida"
                ]}
            ]},
            {"type": "section", "title": "Vitimização Terciária (Social)", "fields": [
                {"label": "Ocorrências", "type": "checkbox_group", "id": "vitimizacao_terciaria", "options": [
                    "Culpabilização da vítima",
                    "Isolamento social",
                    "Perda de emprego",
                    "Julgamento moral"
                ]}
            ]}
        ]
    },
    "Tela_Sintese_Analitica": {
        "title": "Síntese Analítica",
        "content": [
            {"type": "section", "title": "Análise Técnica", "fields": [
                {"label": "Unidade Analítica", "type": "textarea", "id": "unidade_analitica", "rows": 5},
                {"label": "Avaliação de Riscos", "type": "textarea", "id": "avaliacao_riscos", "rows": 5},
                {"label": "Plano de Prevenção", "type": "textarea", "id": "plano_prevencao", "rows": 5}
            ]},
            {"type": "section", "title": "Classificação", "fields": [
                {"label": "Nível de Risco (Cor)", "type": "select", "id": "cor_risco", "options": ["Verde (Baixo)", "Amarelo (Médio)", "Laranja (Alto)", "Vermelho (Crítico)"]},
                {"label": "Data de Vencimento", "type": "date", "id": "data_vencimento"}
            ]}
        ]
    },
    "Tela_Matriz_De_Risco": {
        "title": "Matriz de Risco",
        "content": [
            {"type": "section", "title": "Avaliação de Fatores", "fields": [
                {"label": "Matriz Interativa", "type": "placeholder", "text": "[Componente Visual da Matriz de Risco - Grid 5x5]"},
                {"label": "Score Calculado", "type": "text", "id": "score_risco", "readonly": True}
            ]}
        ]
    },
    "Tela_Acompanhamento": {
        "title": "Acompanhamentos",
        "content": [
            {"type": "section", "title": "Histórico", "fields": [
                {"label": "Novo Acompanhamento", "type": "button", "action": "novoAcompanhamento()"},
                {"type": "gallery", "title": "Lista de Acompanhamentos", "id": "galeria_acompanhamentos", "columns": ["Data", "Tipo", "Responsável", "Síntese"]}
            ]}
        ]
    },
    "Tela_Acompanhamento_Detalhes": {
        "title": "Detalhes do Acompanhamento",
        "content": [
            {"type": "section", "title": "Registro", "fields": [
                {"label": "Data", "type": "date", "id": "data_acompanhamento"},
                {"label": "Tipo de Atendimento", "type": "select", "id": "tipo_atendimento", "options": ["Presencial", "Remoto", "Visita Domiciliar", "Reunião de Rede"]},
                {"label": "Síntese do Atendimento", "type": "textarea", "id": "sintese_atendimento", "rows": 10},
                {"label": "Encaminhamentos Realizados", "type": "textarea", "id": "encaminhamentos"}
            ]}
        ]
    },
    "Tela_Referencias": {
        "title": "Referências",
        "content": [
            {"type": "section", "title": "Referências Bibliográficas e Normativas", "fields": [
                {"label": "Conteúdo", "type": "textarea", "id": "referencias_texto", "rows": 15}
            ]}
        ]
    },
    "Tela_Encerramento": {
        "title": "Encerramento do Caso",
        "content": [
            {"type": "section", "title": "Finalização", "fields": [
                {"label": "Data de Encerramento", "type": "date", "id": "data_encerramento"},
                {"label": "Motivo/Forma de Encerramento", "type": "select", "id": "motivo_encerramento", "options": ["Conclusão do objeto", "Desistência da vítima", "Transferência de órgão", "Óbito", "Outros"]},
                {"label": "Observações Finais", "type": "textarea", "id": "observacoes_finais"}
            ]},
            {"type": "section", "title": "Ação", "fields": [
                {"label": "Encerrar Caso", "type": "button", "action": "encerrarCaso()", "style": "background-color: #d32f2f;"}
            ]}
        ]
    },
    "Tela_Anexos": {
        "title": "Anexos",
        "content": [
            {"type": "section", "title": "Documentos do Caso", "fields": [
                {"label": "Upload de Arquivo", "type": "file", "id": "upload_anexo"},
                {"type": "gallery", "title": "Arquivos Anexados", "id": "galeria_anexos", "columns": ["Nome do Arquivo", "Data", "Tamanho"]}
            ]}
        ]
    },
    "Tela_Buscar_Casos": {
        "title": "Buscar Casos",
        "content": [
            {"type": "section", "title": "Filtros de Busca", "fields": [
                {"label": "Buscar por Nome/CPF/ID", "type": "text", "id": "busca_termo"},
                {"label": "Comarca", "type": "select", "id": "filtro_comarca", "options": ["Todas", "BELO HORIZONTE", "CONTAGEM", "..."]},
                {"label": "Status", "type": "select", "id": "filtro_status", "options": ["Todos", "Abertos", "Encerrados"]},
                {"label": "Buscar", "type": "button", "action": "buscar()"}
            ]},
            {"type": "section", "title": "Resultados", "fields": [
                {"type": "gallery", "title": "Casos Encontrados", "id": "galeria_resultados", "columns": ["ID", "Nome", "Data Entrada", "Status", "Ações"]}
            ]}
        ]
    },
    "Tela_Dashboards": {
        "title": "Dashboards",
        "content": [
            {"type": "section", "title": "Indicadores Gerais", "fields": [
                {"type": "placeholder", "text": "[Gráfico: Casos por Mês]"},
                {"type": "placeholder", "text": "[Gráfico: Tipos de Violência]"},
                {"type": "placeholder", "text": "[Gráfico: Perfil das Vítimas]"}
            ]}
        ]
    },
    "Tela_Relatorio": {
        "title": "Relatórios",
        "content": [
            {"type": "section", "title": "Gerar Relatório", "fields": [
                {"label": "Tipo de Relatório", "type": "select", "id": "tipo_relatorio", "options": ["Relatório Geral", "Relatório Estatístico", "Ficha do Caso"]},
                {"label": "Período Inicial", "type": "date", "id": "data_inicio"},
                {"label": "Período Final", "type": "date", "id": "data_fim"},
                {"label": "Gerar PDF", "type": "button", "action": "gerarPDF()"},
                {"label": "Exportar Excel", "type": "button", "action": "exportarExcel()"}
            ]}
        ]
    },
    "Tela_Gestao_Usuarios": {
        "title": "Gestão de Usuários",
        "content": [
            {"type": "section", "title": "Usuários do Sistema", "fields": [
                {"label": "Novo Usuário", "type": "button", "action": "novoUsuario()"},
                {"type": "gallery", "title": "Lista de Usuários", "id": "galeria_usuarios", "columns": ["Nome", "Email", "Perfil", "Status"]}
            ]}
        ]
    },
    "Tela_Carregamento": {
        "title": "Carregando...",
        "content": [
            {"type": "placeholder", "text": "[Spinner de Carregamento]", "style": "text-align: center; padding: 50px;"}
        ]
    },
    "Tela_DEV": {
        "title": "Área do Desenvolvedor",
        "content": [
            {"type": "section", "title": "Debug", "fields": [
                {"label": "Variáveis Globais", "type": "textarea", "id": "debug_vars", "readonly": True, "rows": 10},
                {"label": "Limpar Cache", "type": "button", "action": "clearCache()"}
            ]}
        ]
    }
}

def render_field(field):
    label = f'<label for="{field.get("id", "")}">{field.get("label", "")}</label>' if "label" in field else ""
    
    if field["type"] == "text":
        return f'<div class="form-group">{label}<input type="text" id="{field.get("id", "")}" name="{field.get("id", "")}"></div>'
    elif field["type"] == "password":
        return f'<div class="form-group">{label}<input type="password" id="{field.get("id", "")}" name="{field.get("id", "")}"></div>'
    elif field["type"] == "date":
        return f'<div class="form-group">{label}<input type="date" id="{field.get("id", "")}" name="{field.get("id", "")}"></div>'
    elif field["type"] == "number":
        return f'<div class="form-group">{label}<input type="number" id="{field.get("id", "")}" name="{field.get("id", "")}"></div>'
    elif field["type"] == "email":
        return f'<div class="form-group">{label}<input type="email" id="{field.get("id", "")}" name="{field.get("id", "")}"></div>'
    elif field["type"] == "textarea":
        rows = field.get("rows", 3)
        return f'<div class="form-group">{label}<textarea id="{field.get("id", "")}" name="{field.get("id", "")}" rows="{rows}"></textarea></div>'
    elif field["type"] == "select":
        options = "".join([f'<option value="{opt}">{opt}</option>' for opt in field.get("options", [])])
        return f'<div class="form-group">{label}<select id="{field.get("id", "")}" name="{field.get("id", "")}">{options}</select></div>'
    elif field["type"] == "radio":
        options_html = ""
        for opt in field.get("options", []):
            options_html += f'<div class="radio-item"><input type="radio" name="{field.get("id", "")}" value="{opt}"> {opt}</div>'
        return f'<div class="form-group">{label}<div class="radio-group">{options_html}</div></div>'
    elif field["type"] == "checkbox_group":
        options_html = ""
        for opt in field.get("options", []):
            options_html += f'<div class="checkbox-item"><input type="checkbox" name="{field.get("id", "")}" value="{opt}"> {opt}</div>'
        return f'<div class="form-group">{label}<div class="checkbox-group">{options_html}</div></div>'
    elif field["type"] == "button":
        style = f' style="{field.get("style", "")}"' if "style" in field else ""
        return f'<div class="form-group"><button onclick="{field.get("action", "")}"{style}>{field.get("label", "Button")}</button></div>'
    elif field["type"] == "gallery":
        cols = "".join([f'<th>{col}</th>' for col in field.get("columns", [])])
        return f'''
        <div class="form-group">
            <h3>{field.get("title", "Gallery")}</h3>
            <div class="gallery">
                <table style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #eee; text-align: left;">{cols}</tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="{len(field.get("columns", []))}" style="padding: 20px; text-align: center; color: #777;">Nenhum item encontrado</td></tr>
                    </tbody>
                </table>
                <button style="margin-top: 10px; font-size: 12px; padding: 5px 10px;">+ Adicionar Item</button>
            </div>
        </div>
        '''
    elif field["type"] == "file":
        return f'<div class="form-group">{label}<input type="file" id="{field.get("id", "")}"></div>'
    elif field["type"] == "placeholder":
        style = f' style="{field.get("style", "")}"' if "style" in field else ""
        return f'<div class="form-group"{style}><div style="border: 2px dashed #ccc; padding: 20px; text-align: center; color: #777; background: #f9f9f9;">{field.get("text", "Placeholder")}</div></div>'
    
    return ""

def generate_html(screen_name, screen_data):
    content_html = ""
    for item in screen_data["content"]:
        if item["type"] == "section":
            fields_html = "".join([render_field(f) for f in item["fields"]])
            content_html += f'''
            <div class="section">
                <h2>{item.get("title", "")}</h2>
                {fields_html}
            </div>
            '''
        elif item["type"] == "gallery": # Top level gallery
             content_html += render_field(item)
        elif item["type"] == "placeholder":
             content_html += render_field(item)

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{screen_data['title']}</title>
    {STYLE}
</head>
<body>
    <div class="screen-container">
        <h1>{screen_data['title']}</h1>
        <form>
            {content_html}
        </form>
        
        <div class="nav-bar">
            <button type="button" onclick="history.back()">Voltar</button>
            <button type="button" onclick="alert('Salvo!')">Salvar</button>
        </div>
    </div>
</body>
</html>
"""
    return html

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    for screen_name, screen_data in SCREENS.items():
        file_path = os.path.join(OUTPUT_DIR, f"{screen_name}.html")
        html_content = generate_html(screen_name, screen_data)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"Generated: {file_path}")

if __name__ == "__main__":
    main()
