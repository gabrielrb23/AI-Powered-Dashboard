import { NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { parseWideCSV } from '@/lib/parseCSV';
import { computeStats } from '@/lib/metrics';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Lee todos los .csv de la carpeta automáticamente
    const files = readdirSync(dataDir).filter(f => f.endsWith('.csv'));

    const allPoints = files.flatMap(filename => {
      const raw = readFileSync(path.join(dataDir, filename), 'utf-8');
      return parseWideCSV(raw);
    });

    // Une, desduplicay ordena
    const merged = allPoints
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .filter((point, i, arr) =>
        i === 0 || point.timestamp.getTime() !== arr[i - 1].timestamp.getTime()
      );

    const stats = computeStats(merged);

    const serialized = merged.map(p => ({
      timestamp: p.timestamp.toISOString(),
      value: p.value,
    }));

    return NextResponse.json({ data: serialized, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error leyendo CSVs' }, { status: 500 });
  }
}