const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1MMM44QjzEjcqC2-IXAtpK99teppVk-EjfQ1_0giLWds';

function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        let currentKey = null;
        const lines = envContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.includes('=') && !currentKey) {
                const match = trimmed.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    let val = match[2].trim();
                    if (key === 'GOOGLE_SHEETS_PRIVATE_KEY') {
                        currentKey = key;
                        env[key] = val;
                    } else {
                        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                        env[key] = val;
                    }
                }
            } else if (currentKey === 'GOOGLE_SHEETS_PRIVATE_KEY') {
                env[currentKey] += '\n' + line;
            }
        }
        if (env.GOOGLE_SHEETS_PRIVATE_KEY) {
            let key = env.GOOGLE_SHEETS_PRIVATE_KEY;
            if (key.startsWith('"')) key = key.slice(1);
            if (key.endsWith('"')) key = key.slice(0, -1);
            env.GOOGLE_SHEETS_PRIVATE_KEY = key.replace(/\\n/g, '\n');
        }
        return env;
    } catch (e) { return {}; }
}

async function run() {
    const env = loadEnv();
    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL, private_key: env.GOOGLE_SHEETS_PRIVATE_KEY },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Get List of Sheets
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetTitles = meta.data.sheets.map(s => s.properties.title);
    console.log('Sheet Titles:', sheetTitles);

    // 2. Read each sheet safely
    for (const title of sheetTitles) {
        if (title.includes('Config')) continue; // skip config
        try {
            console.log(`\n--- Reading [${title}] ---`);
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `'${title}'!A1:E20` // Use quotes for safety
            });
            const rows = res.data.values || [];
            if (rows.length > 0) {
                rows.forEach(r => console.log(JSON.stringify(r)));
            } else {
                console.log('(Empty)');
            }
        } catch (e) {
            console.log(`Error reading ${title}: ${e.message}`);
        }
    }
}
run();
