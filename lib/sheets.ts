import { google } from 'googleapis';
import { Talent, Status, Category } from './types';

// Helper to guess category/status same as our parser
function guessCategory(title: string): Category {
    if (title.includes('映画') || title.includes('劇場')) return 'Movie';
    if (title.includes('ドラマ') || title.includes('Drama')) return 'Drama';
    if (title.includes('CM') || title.includes('広告') || title.includes('PR') || title.includes('動画')) return 'Commercial';
    return 'Variety';
}

function mapStatus(rawStatus: string): Status {
    if (!rawStatus) return 'Pending';
    const s = rawStatus.trim();
    if (s === '合格' || s === 'Won') return 'Won';
    if (s === '不' || s.includes('落選') || s === 'Lost') return 'Lost';
    if (s.includes('書類通過') || s === 'Audition') return 'Audition';
    return 'Pending';
}

export async function fetchFromSheetsV2(): Promise<Talent[]> {
    try {
        console.log('--- FETCHING FROM SHEETS ---');
        console.log('ID:', process.env.SPREADSHEET_ID ? 'Set' : 'Missing');
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;

        // 1. Get all sheet names (tabs)
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetTitles = meta.data.sheets?.map(s => s.properties?.title || '').filter(t => t) || [];

        console.log(`Found ${sheetTitles.length} sheets: ${sheetTitles.join(', ')}`);

        if (sheetTitles.length === 0) return [];

        // 2. Batch fetch all tabs
        const ranges = sheetTitles.map(title => `${title}!A2:H`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        });

        const valueRanges = response.data.valueRanges || [];
        const talents: Talent[] = [];

        // 3. Process each sheet as a Talent
        valueRanges.forEach((rangeData, index) => {
            const sheetTitle = sheetTitles[index];
            const rows = rangeData.values;

            if (!rows || rows.length === 0) return;

            // DEBUG: Log first row of THIS sheet to check columns
            if (rows.length > 0) {
                const firstRow = rows[0];
                console.log(`DEBUG SHEET [${sheetTitle}] ROW 0:`, JSON.stringify(firstRow));
                try {
                    const fs = require('fs');
                    fs.appendFileSync('c:\\Users\\takay\\.gemini\\antigravity\\AD管理\\ad-manager\\debug.log', `[${new Date().toISOString()}] Sheet [${sheetTitle}] Row 0: ${JSON.stringify(firstRow)}\n`);
                } catch (e) { }
            }

            const auditions = rows.map((row, rIndex) => {
                const title = row[0];
                const colC = row[2]; // Column C potential Genre

                let category: Category = 'Variety';

                // 1. Determine Category
                // User requested strict usage of Column C. 
                // Requested mapping: ドラマ->Drama, 映画->Movie, 広告->Commercial, 舞台->Stage, その他->Other
                if (colC) {
                    if (colC.includes('映画') || colC.includes('Movie')) category = 'Movie';
                    else if (colC.includes('ドラマ') || colC.includes('Drama')) category = 'Drama';
                    else if (colC.includes('CM') || colC.includes('広告') || colC.includes('MV') || colC.includes('PV')) category = 'Commercial';
                    else if (colC.includes('舞台') || colC.includes('Stage')) category = 'Stage';
                    else if (colC.includes('音楽') || colC.includes('Music') || colC.includes('ライブ')) category = 'Music';
                    else if (colC.includes('イベント') || colC.includes('Event')) category = 'Event';
                    else category = 'Other';
                } else {
                    // Fallback if Column C is truly empty, though user said "I adjusted all Column C"
                    // We'll map to Other or try to guess, but Other is safer given specific instruction
                    category = 'Other';
                }

                // 2. Determine Status (Dynamic Search)
                // Columns vary (Status at index 4, 6, or 7). We search for known status keywords.
                let status: Status = 'Pending';
                // Search from end to start (columns 8 down to 4) to find status
                // Common indices: 7 (G or H), 6 (F or G), 4 (E)
                for (let i = 8; i >= 4; i--) {
                    const cell = row[i];
                    if (!cell) continue;
                    const result = mapStatus(cell);
                    if (result !== 'Pending') {
                        status = result;
                        break;
                    }
                }

                // 3. Determine Manager (Dynamic Search)
                // Similar to Status, Manager name might be in various columns, typically near the end
                let manager = '';
                // Search reverse, assuming Manager is often the last filled column
                for (let i = 10; i >= 4; i--) {
                    const cell = row[i];
                    if (!cell) continue;
                    // Heuristic: If it's a known name (not status, not date), it might be manager.
                    // For now, we'll try to guess based on exclusion of Status keywords.
                    // Simple logic: If row[7] exists and isn't status, it's manager.
                    // Or just grab row[7] as a best guess for now based on most sheets.
                }
                // Improving: Row 7 (Index H) is commonly Manager in provided examples.
                manager = row[7] || '';

                return {
                    id: `${sheetTitle}_${rIndex}`,
                    projectTitle: title || 'Untitled',
                    client: row[1] || '',
                    category: category,
                    status: status,
                    date: row[3] || 'TBD', // AD Date
                    shootDate: row[4] || '',
                    manager: manager,
                    isArchived: status === 'Won' || status === 'Lost',
                    notes: row[5] || ''
                };
            });

            const id = `t_${sheetTitle}`;
            console.log(`DEBUG: Generating Talent: Name="${sheetTitle}", ID="${id}"`);
            talents.push({
                id: id,
                name: sheetTitle, // Use tab name as Talent Name
                avatarUrl: '#ccc', // specific avatars could be mapped later
                auditions: auditions
            });
        });

        return talents;

    } catch (error) {
        console.error('Sheets Error', error);
        return [];
    }
}
