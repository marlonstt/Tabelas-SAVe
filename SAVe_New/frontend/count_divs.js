const fs = require('fs');

const filePath = 'c:/Users/User/Desktop/SAVe_Svelt e GoLang/Tabelas SAVe/SAVe_New/frontend/src/components/sections/SituacaoJuridica.svelte';
const ranges = [
    { name: 'Container 2', start: 830, end: 966 },
    { name: 'Container 3', start: 969, end: 1265 },
    { name: 'Container 4', start: 1268, end: 1346 },
    { name: 'Container 5', start: 1349, end: 1448 },
    { name: 'Container 6', start: 1451, end: 1570 },
    { name: 'Container 7', start: 1573, end: 1754 },
    { name: 'Container 8', start: 1761, end: 2088 }
];

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    ranges.forEach(range => {
        let open = 0;
        let close = 0;
        for (let i = range.start - 1; i < range.end; i++) {
            const line = lines[i];
            const openMatches = (line.match(/<div/g) || []).length;
            const closeMatches = (line.match(/<\/div>/g) || []).length;
            open += openMatches;
            close += closeMatches;
        }
        console.log(`${range.name}: Open=${open}, Close=${close}, Diff=${open - close}`);
    });

} catch (err) {
    console.error(err);
}
