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
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Write access
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Load local data
    const dataPath = path.join(__dirname, 'sns_final.json');
    const newData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Read Sheet
    const range = 'SNS_History!A1:E100';
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range });
    const rows = res.data.values || [];

    // Header: Date, Name, Instagram, TikTok, X
    // Map: [0] Date, [1] Name, [2] Insta, [3] TikTok, [4] X

    const updates = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`; // approximate match logic

    rows.forEach((row, index) => {
        if (index === 0) return; // skip header
        const name = row[1];
        if (newData[name]) {
            // Found match
            const target = newData[name];
            // Format: Insta, TikTok, X
            // If row is short, pad it? no, we construct the update range specific to this row

            // We want to update Col C, D, E for this row
            // Excel row index is index + 1
            const rowIndex = index + 1;

            updates.push({
                range: `SNS_History!C${rowIndex}:E${rowIndex}`,
                values: [[target.instagram, target.tiktok, target.twitter]]
            });
            console.log(`Prepared update for ${name} at row ${rowIndex}`);
        }
    });

    if (updates.length === 0) {
        console.log('No matching rows found to update.');
        return;
    }

    // Execute Batch Update
    const body = {
        valueInputOption: 'USER_ENTERED',
        data: updates
    };

    try {
        const result = await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: body
        });
        console.log(`${result.data.totalUpdatedRows} rows updated.`);
    } catch (e) {
        console.error('Update failed:', e.message);
        if (e.message.includes('insufficient permissions')) {
            console.log('Permission denied. Please verify service account has Editor role.');
        }
    }
}
run();
