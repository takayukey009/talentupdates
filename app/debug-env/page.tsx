
import { getTalents } from '@/lib/data';

export default async function DebugEnvPage() {
    const talents = await getTalents();
    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Debug Environment</h1>
            <h2>Talents Dump ({talents.length})</h2>
            <pre style={{ background: '#eee', padding: '10px' }}>
                {JSON.stringify(talents.map(t => ({ id: t.id, name: t.name })), null, 2)}
            </pre>
            <h2>Env Check</h2>
            <p>SPREADSHEET_ID: {process.env.SPREADSHEET_ID ? 'SET' : 'MISSING'}</p>
        </div>
    );
}
