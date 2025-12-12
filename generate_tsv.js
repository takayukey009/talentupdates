const fs = require('fs');
const path = require('path');



const currentDataPath = path.join(__dirname, 'data.json');
const outputPath = path.join(__dirname, 'export.tsv');

try {
    const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf-8'));

    // Start with BOM for Excel compatibility + Header
    let tsvContent = '\uFEFF' + ['Talent', 'Project', 'Category', 'Status', 'Date', 'Notes'].join('\t') + '\n';

    currentData.forEach(talent => {
        talent.auditions.forEach(audition => {
            // Normalize newlines in notes to spaces
            const cleanNotes = (audition.notes || '').replace(/[\r\n]+/g, ' ');

            const row = [
                talent.name,
                audition.projectTitle,
                audition.category,
                audition.status,
                audition.date,
                cleanNotes
            ].join('\t');

            tsvContent += row + '\n';
        });
    });

    fs.writeFileSync(outputPath, tsvContent, 'utf-8');
    console.log(`Successfully exported TSV to ${outputPath}`);
} catch (error) {
    console.error('Error processing data:', error);
}
