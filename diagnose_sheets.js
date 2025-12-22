const { google } = require('googleapis');
const fs = require('fs');

async function diagnose() {
    try {
        const envContent = fs.readFileSync('.env.local', 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const index = line.indexOf('=');
            if (index > 0) {
                const key = line.substring(0, index).trim();
                const value = line.substring(index + 1).trim();
                env[key] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
            }
        });

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: (env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = env.SPREADSHEET_ID;

        console.log('Fetching spreadsheet metadata...');
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetTitles = meta.data.sheets.map(s => s.properties.title);
        console.log('Sheet Titles:', sheetTitles.join(', '));

        if (sheetTitles.includes('SNS_History')) {
            console.log('Fetching SNS_History data...');
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'SNS_History!A1:G20',
            });
            console.log('SNS_History Rows:');
            console.log(JSON.stringify(res.data.values, null, 2));
        } else {
            console.log('SNS_History sheet NOT FOUND.');
        }

    } catch (e) {
        console.error('Diagnosis Failed:', e.message);
    }
}

diagnose();
