const fs = require('fs');
const path = require('path');

const pages = [
    { name: 'Identificacao', title: 'Identificação', desc: 'Dados pessoais da vítima' },
    { name: 'SituacaoJuridica', title: 'Situação Jurídica', desc: 'Informações processuais e jurídicas' },
    { name: 'Saude', title: 'Saúde', desc: 'Informações de saúde da vítima' },
    { name: 'HabitacaoTerritorio', title: 'Habitação e Território', desc: 'Dados de moradia e território' },
    { name: 'Assistencia', title: 'Assistência', desc: 'Acesso a serviços de assistência social' },
    { name: 'EnsinoTrabalhoRenda', title: 'Ensino, Trabalho e Renda', desc: 'Escolaridade e situação de trabalho' },
    { name: 'Vinculos', title: 'Vínculos', desc: 'Informações sobre vínculos familiares' },
    { name: 'ProtecaoSeguranca', title: 'Proteção e Segurança', desc: 'Avaliação de riscos e ameaças' },
    { name: 'Agressor', title: 'Perfil do Agressor', desc: 'Informações sobre o agressor' },
    { name: 'Vitimizacao', title: 'Vitimização', desc: 'Detalhes sobre vitimização' },
    { name: 'SinteseAnalitica', title: 'Síntese Analítica', desc: 'Resumo analítico do caso' },
    { name: 'MatrizRisco', title: 'Matriz de Risco', desc: 'Avaliação de risco do caso' },
    { name: 'Acompanhamentos', title: 'Acompanhamentos', desc: 'Histórico de atendimentos' },
    { name: 'Referencias', title: 'Referências', desc: 'Referências e encaminhamentos' },
    { name: 'Encerramento', title: 'Encerramento', desc: 'Dados de fechamento do caso' },
];

const template = (name, title, desc) => `import FormPage from '../../components/forms/FormPage';

export default function ${name}() {
  return (
    <FormPage title="${title}" description="${desc}">
      <div className="space-y-4">
        <p className="text-center py-8" style={{ color: '#605E5C' }}>
          Formulário ${title} - Em desenvolvimento
        </p>
        {/* TODO: Add form fields */}
      </div>
    </FormPage>
  );
}
`;

const basePath = path.join(__dirname, 'SAVe_Web', 'client', 'src', 'pages', 'cases');

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

pages.forEach(page => {
    const filePath = path.join(basePath, `${page.name}.tsx`);
    fs.writeFileSync(filePath, template(page.name, page.title, page.desc));
    console.log(`Created: ${page.name}.tsx`);
});

console.log('All pages created successfully!');
