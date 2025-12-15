const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const talents = JSON.parse(rawData);

console.log('Count:', talents.length);
talents.forEach(t => {
    console.log(`${t.name} (${t.id})`);
    if (t.sns && t.sns.length > 0) {
        console.log('  Has SNS history:', t.sns.length);
    }
});
