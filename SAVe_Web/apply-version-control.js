#!/usr/bin/env node

/**
 * Script para aplicar ProtectedFormPage e atualizar FormNavigation em todas as telas
 * 
 * Uso: node apply-version-control.js
 */

const fs = require('fs');
const path = require('path');

// Mapeamento de telas e seus stepIds
const screens = [
    // Telas da versão breve (não precisam de proteção, mas precisam atualizar FormNavigation)
    { file: 'DadosEntrada.tsx', stepId: 'dados-entrada', needsProtection: false },
    { file: 'Identificacao.tsx', stepId: 'identificacao', needsProtection: false },
    { file: 'SituacaoJuridica.tsx', stepId: 'situacao-juridica', needsProtection: false },
    { file: 'ProtecaoSeguranca.tsx', stepId: 'protecao', needsProtection: false },
    { file: 'Vitimizacao.tsx', stepId: 'vitimizacao', needsProtection: false },

    // Telas restritas (precisam de proteção)
    { file: 'Saude.tsx', stepId: 'saude', needsProtection: true },
    { file: 'HabitacaoTerritorio.tsx', stepId: 'habitacao', needsProtection: true },
    { file: 'Assistencia.tsx', stepId: 'assistencia', needsProtection: true },
    { file: 'EnsinoTrabalhoRenda.tsx', stepId: 'ensino', needsProtection: true },
    { file: 'Vinculos.tsx', stepId: 'vinculos', needsProtection: true },
    { file: 'Agressor.tsx', stepId: 'agressor', needsProtection: true },
    { file: 'SinteseAnalitica.tsx', stepId: 'sintese', needsProtection: true },
    { file: 'Acompanhamento.tsx', stepId: 'acompanhamento', needsProtection: true },
    { file: 'Encerramento.tsx', stepId: 'encerramento', needsProtection: true },
];

const basePath = path.join(__dirname, 'client', 'src', 'pages', 'cases');

function updateFile(screen) {
    const filePath = path.join(basePath, screen.file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Arquivo não encontrado: ${screen.file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Adicionar import do ProtectedFormPage (se necessário)
    if (screen.needsProtection && !content.includes('ProtectedFormPage')) {
        const importLine = "import ProtectedFormPage from '../../components/ProtectedFormPage';";

        // Adicionar após os outros imports
        if (content.includes("import FormNavigation")) {
            content = content.replace(
                /(import FormNavigation[^;]+;)/,
                `$1\n${importLine}`
            );
            modified = true;
        }
    }

    // 2. Remover import de formStepsComplete
    if (content.includes('formStepsComplete')) {
        content = content.replace(/import\s+{\s*formStepsComplete\s*}\s+from[^;]+;\s*/g, '');
        modified = true;
    }

    // 3. Atualizar FormNavigation (remover prop steps)
    if (content.includes('steps={formStepsComplete}')) {
        content = content.replace(/steps={formStepsComplete}\s+/g, '');
        modified = true;
    }

    // 4. Adicionar ProtectedFormPage wrapper (se necessário)
    if (screen.needsProtection && !content.includes('<ProtectedFormPage')) {
        // Encontrar o return e adicionar wrapper
        const returnMatch = content.match(/(return\s*\(\s*<MainLayout>)/);
        if (returnMatch) {
            content = content.replace(
                /(return\s*\(\s*)/,
                `$1<ProtectedFormPage stepId="${screen.stepId}">\n      `
            );

            // Adicionar fechamento antes do último );
            content = content.replace(
                /(\s*\);\s*}\s*$)/,
                `    </ProtectedFormPage>\n$1`
            );
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Atualizado: ${screen.file}`);
    } else {
        console.log(`ℹ️  Sem mudanças: ${screen.file}`);
    }
}

console.log('🚀 Aplicando controle de versão em todas as telas...\n');

screens.forEach(screen => {
    updateFile(screen);
});

console.log('\n✨ Processo concluído!');
console.log('\n📝 Próximos passos:');
console.log('1. Verificar se todas as telas foram atualizadas corretamente');
console.log('2. Testar a navegação entre versão breve e completa');
console.log('3. Verificar se as rotas estão protegidas');
