const fs = require('fs');
const filePath = 'c:/Users/User/Desktop/SAVe_Svelt e GoLang/Tabelas SAVe/SAVe_New/frontend/src/components/sections/SituacaoJuridica.svelte';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const stack = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Match tags
        const regex = /<\/?div[^>]*>|{#if[^}]*}|{\/if}|{#each[^}]*}|{\/each}/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
            const token = match[0];
            if (token.startsWith('</div')) {
                if (stack.length === 0 || stack[stack.length - 1] !== 'div') {
                    console.log(`ERROR at line ${lineNum}: Unexpected </div>. Stack top: ${stack[stack.length - 1]}`);
                    process.exit(0);
                }
                stack.pop();
            } else if (token.startsWith('<div')) {
                stack.push('div');
            } else if (token.startsWith('{/if')) {
                if (stack.length === 0 || stack[stack.length - 1] !== 'if') {
                    console.log(`ERROR at line ${lineNum}: Unexpected {/if}. Stack top: ${stack[stack.length - 1]}`);
                    process.exit(0);
                }
                stack.pop();
            } else if (token.startsWith('{#if')) {
                stack.push('if');
            } else if (token.startsWith('{/each')) {
                if (stack.length === 0 || stack[stack.length - 1] !== 'each') {
                    console.log(`ERROR at line ${lineNum}: Unexpected {/each}. Stack top: ${stack[stack.length - 1]}`);
                    process.exit(0);
                }
                stack.pop();
            } else if (token.startsWith('{#each')) {
                stack.push('each');
            }
        }
    }

    if (stack.length > 0) {
        console.log(`ERROR: File ended with open blocks: ${stack.join(', ')}`);
    } else {
        console.log('SUCCESS: All tags balanced.');
    }

} catch (err) {
    console.error(err);
}
