const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/sections/SituacaoJuridica.svelte');
console.log(`Reading file: ${filePath}`);

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const stack = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Match tags
        const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
        let match;
        while ((match = tagRegex.exec(line)) !== null) {
            const tag = match[0];
            const tagName = match[1];

            if (tag.endsWith('/>') || ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName.toLowerCase())) {
                continue;
            }

            if (tag.startsWith('</')) {
                if (stack.length === 0) {
                    console.log(`Line ${i + 1}: Unexpected closing tag ${tag}`);
                } else {
                    const last = stack.pop();
                    if (last.tagName !== tagName) {
                        console.log(`Line ${i + 1}: Mismatch! Expected closing ${last.tagName} (opened at ${last.line}), found ${tag}`);
                    }
                }
            } else {
                stack.push({ tagName, line: i + 1 });
            }
        }

        // Match blocks
        const blockRegex = /{\s*([#/:])\s*([a-zA-Z0-9_]+)/g;
        let blockMatch;
        while ((blockMatch = blockRegex.exec(line)) !== null) {
            const type = blockMatch[1];
            const name = blockMatch[2];

            if (type === '#') {
                stack.push({ tagName: '#' + name, line: i + 1 });
            } else if (type === '/') {
                if (stack.length === 0) {
                    console.log(`Line ${i + 1}: Unexpected closing block {/${name}}`);
                } else {
                    const last = stack.pop();
                    if (last.tagName !== '#' + name) {
                        console.log(`Line ${i + 1}: Mismatch! Expected closing ${last.tagName} (opened at ${last.line}), found {/${name}}`);
                    }
                }
            }
        }
    }

    if (stack.length > 0) {
        console.log('Unclosed tags/blocks:');
        stack.forEach(item => console.log(`${item.tagName} at line ${item.line}`));
    } else {
        console.log('No unclosed tags found.');
    }

} catch (err) {
    console.error('Error reading file:', err);
}
