#!/usr/bin/env python3
"""
Script to generate all SAVe case form pages
This creates the 16 form pages needed for the complete version
"""

import os

# Define all form pages with their configurations
FORM_PAGES = [
    {
        'name': 'DadosEntrada',
        'title': 'Dados de Entrada',
        'description': 'Informações iniciais do caso',
        'fields': ['Data', 'Comarca_origem', 'N_procedimento_MPE', 'Quem_encaminha']
    },
    {
        'name': 'Identificacao',
        'title': 'Identificação',
        'description': 'Dados pessoais da vítima',
        'fields': ['Nome_RC', 'Data_nascimento', 'Idade', 'Naturalidade']
    },
    {
        'name': 'SituacaoJuridica',
        'title': 'Situação Jurídica',
        'description': 'Informações processuais e jurídicas',
        'fields': ['SJ_Num_Processo', 'SJ_Data_Fatos', 'SJ_Tipo_Penal_Fatos']
    },
    {
        'name': 'Saude',
        'title': 'Saúde',
        'description': 'Informações de saúde da vítima',
        'fields': ['HS_Pessoa_deficiencia', 'HS_Condicao_saude']
    },
    {
        'name': 'HabitacaoTerritorio',
        'title': 'Habitação e Território',
        'description': 'Dados de moradia e território',
        'fields': ['Moradia_regular', 'Territorio']
    },
    {
        'name': 'Assistencia',
        'title': 'Assistência',
        'description': 'Acesso a serviços de assistência social',
        'fields': ['Cad_unico', 'Status_cad_unico']
    },
    {
        'name': 'EnsinoTrabalhoRenda',
        'title': 'Ensino, Trabalho e Renda',
        'description': 'Escolaridade e situação de trabalho',
        'fields': ['Grau_escolaridade', 'Situacao_trabalho']
    },
    {
        'name': 'Vinculos',
        'title': 'Vínculos',
        'description': 'Informações sobre vínculos familiares',
        'fields': ['Qtd_Pessoas_Fam', 'Qtd_Filhos_Ent']
    },
    {
        'name': 'ProtecaoSeguranca',
        'title': 'Proteção e Segurança',
        'description': 'Avaliação de riscos e ameaças',
        'fields': ['PS_Natureza_Ameaca', 'PS_Como_Ameaca']
    },
    {
        'name': 'Agressor',
        'title': 'Perfil do Agressor',
        'description': 'Informações sobre o agressor',
        'fields': ['PA_Nome_Civil', 'PA_Tipo_Agressor']
    },
    {
        'name': 'Vitimizacao',
        'title': 'Vitimização Secundária e Terciária',
        'description': 'Detalhes sobre vitimização',
        'fields': ['VST_Dep_repet_reviti', 'VT_Culpa_vit']
    },
    {
        'name': 'SinteseAnalitica',
        'title': 'Síntese Analítica',
        'description': 'Resumo analítico do caso',
        'fields': ['UnidadeAnalitica', 'AvaliacaoDeRiscos']
    },
    {
        'name': 'MatrizRisco',
        'title': 'Matriz de Risco',
        'description': 'Avaliação de risco do caso',
        'fields': ['Cor', 'PlanoDePrevencao']
    },
    {
        'name': 'Acompanhamentos',
        'title': 'Acompanhamentos',
        'description': 'Histórico de atendimentos',
        'fields': ['Tipo_Atendimento', 'Data', 'Sintese']
    },
    {
        'name': 'Referencias',
        'title': 'Referências',
        'description': 'Referências e encaminhamentos',
        'fields': []
    },
    {
        'name': 'Encerramento',
        'title': 'Encerramento',
        'description': 'Dados de fechamento do caso',
        'fields': ['Data', 'Forma_Encerramento_Caso']
    },
]

TEMPLATE = """import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import {{ formStepsComplete }} from '../../config/formSteps';

export default function {name}() {{
  const {{ id }} = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({{}});

  const handleSubmit = (e: React.FormEvent) => {{
    e.preventDefault();
    // TODO: Save data
    console.log('Form data:', formData);
  }};

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b px-8 py-4" style={{{{ borderColor: '#D2D0CE' }}}}>
          <h1 className="text-2xl font-bold" style={{{{ color: '#323130' }}}}>
            {title}
          </h1>
          <p className="text-sm" style={{{{ color: '#605E5C' }}}}>
            {description}
          </p>
        </div>

        <FormNavigation steps={{formStepsComplete}} caseId={{id}} />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={{handleSubmit}} className="bg-white p-6 rounded-lg shadow space-y-6">
              <div className="space-y-4">
                {field_inputs}
              </div>

              <div className="flex justify-between pt-6 border-t" style={{{{ borderColor: '#D2D0CE' }}}}>
                <button
                  type="button"
                  onClick={{() => navigate(-1)}}
                  className="px-6 py-2 rounded border"
                  style={{{{ borderColor: '#D2D0CE', color: '#323130' }}}}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded text-white"
                  style={{{{ backgroundColor: '#6264A7' }}}}
                >
                  Salvar e Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}}
"""

def generate_field_inputs(fields):
    if not fields:
        return """<p className="text-center py-8" style={{ color: '#605E5C' }}>
                  Seção em desenvolvimento
                </p>"""
    
    inputs = []
    for field in fields[:4]:  # Limit to 4 fields for demo
        inputs.append(f"""<div>
                  <label className="block text-sm font-medium mb-2" style={{{{ color: '#323130' }}}}>
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    style={{{{ borderColor: '#D2D0CE' }}}}
                    value={{formData.{field} || ''}}
                    onChange={{(e) => setFormData({{...formData, {field}: e.target.value}})}}
                  />
                </div>""")
    return '\n                '.join(inputs)

def main():
    base_path = r"c:\Users\User\Desktop\Tabelas SAVe\SAVe_Web\client\src\pages\cases"
    os.makedirs(base_path, exist_ok=True)
    
    for page in FORM_PAGES:
        content = TEMPLATE.format(
            name=page['name'],
            title=page['title'],
            description=page['description'],
            field_inputs=generate_field_inputs(page['fields'])
        )
        
        file_path = os.path.join(base_path, f"{page['name']}.tsx")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Created: {file_path}")

if __name__ == '__main__':
    main()
    print("\nAll form pages generated successfully!")
"""
