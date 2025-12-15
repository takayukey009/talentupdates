const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1MMM44QjzEjcqC2-IXAtpK99teppVk-EjfQ1_0giLWds'; // Hardcoded

// Env loading (same as before)
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
let currentKey = null;
envContent.split('\n').forEach(line => {
    if (line.includes('=')) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            currentKey = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"')) value = value.slice(1);
            if (value.endsWith('"') && !line.includes('PRIVATE KEY')) value = value.slice(0, -1);
            env[currentKey] = value;
        }
    } else if (currentKey === 'GOOGLE_SHEETS_PRIVATE_KEY') {
        env[currentKey] += '\n' + line;
    }
});
if (env.GOOGLE_SHEETS_PRIVATE_KEY) {
    if (env.GOOGLE_SHEETS_PRIVATE_KEY.endsWith('"')) env.GOOGLE_SHEETS_PRIVATE_KEY = env.GOOGLE_SHEETS_PRIVATE_KEY.slice(0, -1);
    env.GOOGLE_SHEETS_PRIVATE_KEY = env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
}

async function run() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: env.GOOGLE_SHEETS_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        // Get Metadata
        const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const AllSheets = meta.data.sheets.map(s => ({ title: s.properties.title, id: s.properties.sheetId }));
        console.log('Sheets:', JSON.stringify(AllSheets, null, 2));

        // Read SNS_History
        const snsResp = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'SNS_History!A1:E20'
        });
        console.log('SNS_History Data (First 20 rows):');
        console.log(JSON.stringify(snsResp.data.values, null, 2));

        // Read "master" or "master_sheet" to find the 9 talents
        // Trying 'master_sheet!A1:C20'
        const masterResp = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'master_sheet!A1:Z20'
        });
        console.log('master_sheet Data:');
        console.log(JSON.stringify(masterResp.data.values, null, 2));

    } catch (e) {
        console.error(e.message);
    }
}

run();
