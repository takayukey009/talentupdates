const fs = require('fs');
const path = require('path');

const dataJsonPath = path.join(__dirname, 'data.json');
const snsPath = path.join(__dirname, 'sns_final.json');

const talents = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
const snsData = JSON.parse(fs.readFileSync(snsPath, 'utf8'));

let updatedCount = 0;

talents.forEach(t => {
    if (snsData[t.name]) {
        const fresh = snsData[t.name];
        // Ensure sns array exists
        if (!t.sns) t.sns = [];

        // Add new entry for today if not present (or update latest)
        // Simplification: append specific entry for "2025/12/15" to ensure local data has it
        const today = "2025/12/15";

        // Check if today exists
        const existingIdx = t.sns.findIndex(s => s.date === today);
        const entry = {
            date: today,
            instagram: fresh.instagram,
            tiktok: fresh.tiktok,
            x: fresh.twitter
        };

        if (existingIdx >= 0) {
            t.sns[existingIdx] = entry;
        } else {
            t.sns.push(entry);
        }
        updatedCount++;
    }
});

fs.writeFileSync(dataJsonPath, JSON.stringify(talents, null, 2), 'utf8');
console.log(`Updated ${updatedCount} talents in data.json`);
