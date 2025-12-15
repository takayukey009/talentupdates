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

    // Read SNS_History
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'SNS_History!A2:B20' // specific range for names
    });
    const rows = res.data.values || [];
    console.log('--- FOUND NAMES ---');
    rows.forEach(r => {
        if (r[1]) console.log(r[1]);
    });
}
run();
