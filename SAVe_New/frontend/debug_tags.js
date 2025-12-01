const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/User/Desktop/SAVe_Svelt e GoLang/Tabelas SAVe/SAVe_New/frontend/src/components/sections/SituacaoJuridica.svelte';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const stack = [];

    console.log('Starting tag check...');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Simple regex for tags and blocks
        // We need to handle multiple tags per line
        const regex = /(<\/?[\w-]+[^>]*>)|({[#/:][\w\s.]+}|{\/if}|{\/each}|{\/key}|{\/await})/g;

        let match;
        while ((match = regex.exec(line)) !== null) {
            const token = match[0];

            // Ignore void elements and self-closing tags
            if (token.match(/^<[\w-]+\s*.*\/>$/)) continue;
            if (token.match(/^<(input|img|br|hr|meta|link|source|track|wbr|area|base|col|embed|param)/i)) continue;

            // Ignore comments (simple check)
            if (token.startsWith('<!--')) continue;

            if (token.startsWith('</')) {
                // Closing HTML tag
                const tagName = token.match(/^<\/([\w-]+)/)[1];
                if (stack.length === 0) {
                    console.error(`ERROR at line ${lineNum}: Unexpected closing tag <${tagName}>. Stack is empty.`);
                    process.exit(1);
                }
                const last = stack.pop();
                if (last.type !== 'tag' || last.name !== tagName) {
                    console.error(`ERROR at line ${lineNum}: Mismatch! Found </${tagName}> but expected closing for ${last.type} ${last.name} (opened at line ${last.line})`);
                    process.exit(1);
                }
            } else if (token.startsWith('<')) {
                // Opening HTML tag
                const tagName = token.match(/^<([\w-]+)/)[1];
                stack.push({ type: 'tag', name: tagName, line: lineNum });
            } else if (token.startsWith('{/')) {
                // Closing Svelte block
                const blockName = token.match(/^{\/([\w]+)/)[1];
                if (stack.length === 0) {
                    console.error(`ERROR at line ${lineNum}: Unexpected closing block {/${blockName}}. Stack is empty.`);
                    process.exit(1);
                }
                const last = stack.pop();
                // Svelte blocks might be generic like #if, #each. 
                // We just check if the last item was a block.
                // Ideally we match #if with /if, #each with /each.
                if (last.type !== 'block') {
                    console.error(`ERROR at line ${lineNum}: Mismatch! Found {/${blockName}} but expected closing for ${last.type} ${last.name} (opened at line ${last.line})`);
                    process.exit(1);
                }
                // We could check name match too (if vs if, each vs each)
                if (last.name !== blockName && !(last.name.startsWith('if') && blockName === 'if')) {
                    // console.warn(`Warning at line ${lineNum}: Closing {/${blockName}} but opened {#${last.name}}`);
                }
            } else if (token.startsWith('{#')) {
                // Opening Svelte block
                const blockName = token.match(/^{#([\w]+)/)[1];
                stack.push({ type: 'block', name: blockName, line: lineNum });
            } else if (token.startsWith('{:')) {
                // Continuation block (else, then, catch) - doesn't change stack depth usually, 
                // but :else inside #if is fine.
                // We verify we are inside a block.
                if (stack.length === 0 || stack[stack.length - 1].type !== 'block') {
                    console.error(`ERROR at line ${lineNum}: Unexpected {${token}} outside of block.`);
                }
            }
        }
    }

    if (stack.length > 0) {
        console.error(`ERROR: File ended with ${stack.length} unclosed elements:`);
        stack.forEach(item => console.error(`- ${item.type} ${item.name} (opened at line ${item.line})`));
    } else {
        console.log('SUCCESS: No tag mismatches found.');
    }

} catch (err) {
    console.error('Script error:', err);
}
