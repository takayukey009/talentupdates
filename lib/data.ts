import { fetchFromSheetsV2 } from './sheets';
import fs from 'fs';
import path from 'path';
import { Talent } from './types';
import dataFromFile from '../data.json';
import 'server-only'; // Ensure this never bundles to client

// Helper for server-side JSON reading (to ensure fresh read)
function readLocalData(): Talent[] {
    try {
        const dataPath = 'c:\\Users\\takay\\.gemini\\antigravity\\AD管理\\ad-manager\\data.json';
        let fileContents = fs.readFileSync(dataPath, 'utf8');
        // Strip BOM if present
        if (fileContents.charCodeAt(0) === 0xFEFF) {
            fileContents = fileContents.slice(1);
        }
        const parsed = JSON.parse(fileContents);
        console.log(`DEBUG: readLocalData success, found ${parsed.length} talents`);
        return parsed;
    } catch (e) {
        try { fs.appendFileSync('c:\\Users\\takay\\.gemini\\antigravity\\AD管理\\ad-manager\\debug.log', `[${new Date().toISOString()}] readLocalData FAILED: ${e}\n`); } catch (_) { }
        console.error('DEBUG: readLocalData FAILED', e);
        return dataFromFile as Talent[];
    }
}

export async function getTalents(): Promise<Talent[]> {
    console.log('DEBUG: getTalents called');
    console.log('DEBUG: SPREADSHEET_ID =', process.env.SPREADSHEET_ID ? 'SET' : 'MISSING');

    // If spreadsheet ID is set, try sheets
    const EXCLUDED_SHEETS = [
        'ハリセンボン',
        '近藤春菜',
        'ベッキー',
        '宍戸開',
        '中島健太',
        'HKT龍頭',
        'HKT江浦',
        '宮崎早織',
        '森カンナ'
    ];

    let allTalents: Talent[] = [];
    if (process.env.SPREADSHEET_ID) {
        const sheetData = await fetchFromSheetsV2();
        console.log(`DEBUG: fetchFromSheetsV2 returned ${sheetData.length} talents`);
        if (sheetData.length > 0) {
            allTalents = sheetData;
        } else {
            console.log('DEBUG: Sheet data empty, using local data');
            allTalents = readLocalData();
        }
    } else {
        allTalents = readLocalData();
    }

    return allTalents.filter(t => !EXCLUDED_SHEETS.includes(t.name));
}

export async function getTalentById(id: string): Promise<Talent | undefined> {
    const all = await getTalents();
    console.log(`DEBUG: Looking for ID: '${id}' (decoded from URL)`);
    console.log(`DEBUG: Available IDs: ${all.map(t => `'${t.id}'`).join(', ')}`);
    try {
        const logPath = 'c:\\Users\\takay\\.gemini\\antigravity\\AD管理\\ad-manager\\debug.log';
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Looking for ID: '${id}'\n`);
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Available IDs: ${all.map(t => `'${t.id}'`).join(', ')}\n`);
    } catch (e) { console.error('Failed to write to debug log', e); }
    const decoded = decodeURIComponent(id);
    console.log(`DEBUG: Decoded ID: '${decoded}'`);

    const target = all.find(t => t.id === id || t.id === decoded);

    if (!target) {
        console.log(`DEBUG: No match found for '${decoded}'`);
        // Log details for '谷口' specifically if present to debug
        const candidate = all.find(t => t.id.includes('谷口'));
        if (candidate) {
            console.log(`DEBUG: Candidate found: '${candidate.id}'`);
            console.log(`DEBUG: Candidate codes: ${candidate.id.split('').map(c => c.charCodeAt(0)).join(',')}`);
            console.log(`DEBUG: Target codes: ${decoded.split('').map(c => c.charCodeAt(0)).join(',')}`);
        }
    }
    return target;
}

// For client-side backwards compatibility if needed (mostly deprecated)
export function getTalentByIdSync(id: string): Talent | undefined {
    return (dataFromFile as Talent[]).find(t => t.id === id || decodeURIComponent(id) === t.id);
}
