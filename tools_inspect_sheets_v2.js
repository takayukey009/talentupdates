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
                        // Don't process value yet, might be multiline or start of multiline
                        env[key] = val;
                    } else {
                        if (val.startsWith('"') && val.endsWith('"')) {
                            val = val.slice(1, -1);
                        }
                        env[key] = val;
                    }
                }
            } else if (currentKey === 'GOOGLE_SHEETS_PRIVATE_KEY') {
                env[currentKey] += '\n' + line;
            }
        }

        // Post-process key
        if (env.GOOGLE_SHEETS_PRIVATE_KEY) {
            let key = env.GOOGLE_SHEETS_PRIVATE_KEY;
            if (key.startsWith('"')) key = key.slice(1);
            if (key.endsWith('"')) key = key.slice(0, -1);
            env.GOOGLE_SHEETS_PRIVATE_KEY = key.replace(/\\n/g, '\n');
        }

        return env;
    } catch (e) {
        console.error('Env load failed:', e);
        return {};
    }
}

async function run() {
    const env = loadEnv();
    console.log('Client Email:', env.GOOGLE_SHEETS_CLIENT_EMAIL);

    if (!env.GOOGLE_SHEETS_CLIENT_EMAIL) {
        console.error('MISSING EMAIL');
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: env.GOOGLE_SHEETS_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        // Metadata
        const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const titles = meta.data.sheets.map(s => s.properties.title);
        console.log('Sheets Found:', titles);

        // Fetch master_sheet (assuming this is the list of 9)
        if (titles.includes('master_data')) {
            const m = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'master_data!A1:E20'
            });
            console.log('master_data:', JSON.stringify(m.data.values));
        }

        if (titles.includes('SNS_History')) {
            const s = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'SNS_History!A1:E20'
            });
            console.log('SNS_History:', JSON.stringify(s.data.values));
        }

    } catch (e) {
        console.error(e);
    }
}
run();
