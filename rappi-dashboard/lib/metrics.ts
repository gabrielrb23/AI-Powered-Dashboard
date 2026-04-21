import { DataPoint } from './parseCSV';

export type Stats = {
	min: number;
	max: number;
	avg: number;
	maxTimestamp: string;
	minTimestamp: string;
	totalPoints: number;
	peakHour: string;
	bigDrops: { timestamp: string; delta: number }[];
};

export function computeStats(data: DataPoint[]): Stats {
	const sorted = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

	let min = Infinity, max = -Infinity;
	let minTs = '', maxTs = '';
	let sum = 0;
	const bigDrops: { timestamp: string; delta: number }[] = [];

	for (let i = 0; i < sorted.length; i++) {
		const { value, timestamp } = sorted[i];
		const label = timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

		if (value < min) { min = value; minTs = label; }
		if (value > max) { max = value; maxTs = label; }
		sum += value;

		if (i > 0) {
			const delta = value - sorted[i - 1].value;
			if (delta < -500) {
				bigDrops.push({ timestamp: label, delta });
			}
		}
	}

	// Hora con más tiendas en promedio
	const byHour: Record<string, number[]> = {};
	for (const { timestamp, value } of sorted) {
		const hour = timestamp.getHours().toString().padStart(2, '0') + ':00';
		if (!byHour[hour]) byHour[hour] = [];
		byHour[hour].push(value);
	}
	const peakHour = Object.entries(byHour)
		.map(([h, vals]) => ({ h, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
		.sort((a, b) => b.avg - a.avg)[0].h;

	return {
		min, max, avg: Math.round(sum / sorted.length),
		maxTimestamp: maxTs, minTimestamp: minTs,
		totalPoints: sorted.length,
		peakHour,
		bigDrops: bigDrops.slice(0, 5),
	};
}