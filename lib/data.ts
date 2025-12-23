import { fetchFromSheetsV2 } from './sheets';
import fs from 'fs';
import path from 'path';
import { Talent, HighLight } from './types';
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
    const data = await getDashboardData();
    return data.talents;
}

export async function getHighlights(): Promise<HighLight[]> {
    console.log('DEBUG: getHighlights called');
    const data = await getDashboardData();
    return data.highlights;
}

// Internal cache for the request duration (simple singleton-ish for Server Components)
let cachedData: { talents: Talent[], highlights: HighLight[] } | null = null;

async function getDashboardData(): Promise<{ talents: Talent[], highlights: HighLight[] }> {
    if (cachedData) return cachedData;

    const EXCLUDED_SHEETS = [
        'ハリセンボン', '近藤春菜', 'ベッキー', '宍戸開', '中島健太', 'HKT龍頭', 'HKT江浦', '宮崎早織', '森カンナ'
    ];

    let talents: Talent[] = [];
    let highlights: HighLight[] = [];

    if (process.env.SPREADSHEET_ID) {
        const sheetData = await fetchFromSheetsV2();
        talents = sheetData.talents;
        highlights = sheetData.highlights;

        if (talents.length === 0) {
            talents = readLocalData();
        }
    } else {
        talents = readLocalData();
    }

    const filteredTalents = talents.filter(t => !EXCLUDED_SHEETS.includes(t.name));
    cachedData = { talents: filteredTalents, highlights };
    return cachedData;
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
