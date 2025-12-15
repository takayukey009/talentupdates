const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1MMM44QjzEjcqC2-IXAtpK99teppVk-EjfQ1_0giLWds';

// Env load
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
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: env.GOOGLE_SHEETS_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        console.log('--- Master Sheet Data ---');
        // Try to guess where the names are. usually column A or B.
        const r1 = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'master_sheet!A1:B20' });
        if (r1.data.values) console.log('master_sheet:', JSON.stringify(r1.data.values));

        const r2 = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'master_data!A1:B20' });
        if (r2.data.values) console.log('master_data:', JSON.stringify(r2.data.values));

        const r3 = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'master!A1:B20' });
        if (r3.data.values) console.log('master:', JSON.stringify(r3.data.values));

    } catch (e) {
        console.error(e.message);
    }
}
run();
