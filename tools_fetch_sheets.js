const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load env (simple parser since we can't rely on next/env in standalone)
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[match[1]] = value;
    }
});

async function run() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: (env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Try full access
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = env.SPREADSHEET_ID;

        // 1. Get sheets
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetTitles = meta.data.sheets.map(s => s.properties.title);
        console.log('Sheets found:', sheetTitles.join(', '));

        if (!sheetTitles.includes('SNS_History')) {
            console.log('WARNING: SNS_History sheet NOT found.');
        } else {
            // Read SNS_History
            const resp = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'SNS_History!A1:E'
            });
            const rows = resp.data.values || [];
            console.log('SNS_History rows:', rows.length);
            if (rows.length > 0) console.log('Header:', rows[0]);
        }

        // List Talents (Sheets that are not SNS_History or SNS_Config)
        const talents = sheetTitles.filter(t => t !== 'SNS_History' && t !== 'SNS_Config');
        console.log('Talents:', talents);

        return talents;

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
