const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Hardcoded for reliability in this one-off script
const SPREADSHEET_ID = '1MMM44QjzEjcqC2-IXAtpK99teppVk-EjfQ1_0giLWds';

// Parse env for credentials only
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
let currentKey = null;
envContent.split('\n').forEach(line => {
    // Simple parser handling multiline private key
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

// Clean up private key
if (env.GOOGLE_SHEETS_PRIVATE_KEY) {
    if (env.GOOGLE_SHEETS_PRIVATE_KEY.endsWith('"')) {
        env.GOOGLE_SHEETS_PRIVATE_KEY = env.GOOGLE_SHEETS_PRIVATE_KEY.slice(0, -1);
    }
    // Replace literal \n with actual newlines if captured that way
    env.GOOGLE_SHEETS_PRIVATE_KEY = env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
}

async function run() {
    try {
        console.log('Using Spreadsheet ID:', SPREADSHEET_ID);
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: env.GOOGLE_SHEETS_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const sheetTitles = meta.data.sheets.map(s => s.properties.title);
        console.log('Sheets found:', sheetTitles.join(', '));

        const talents = sheetTitles.filter(t => t !== 'SNS_History' && t !== 'SNS_Config');
        console.log('Talent List:', JSON.stringify(talents));

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.error('Response data:', e.response.data);
    }
}

run();
