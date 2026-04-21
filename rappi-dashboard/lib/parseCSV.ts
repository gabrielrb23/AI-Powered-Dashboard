export type DataPoint = {
	timestamp: Date;
	value: number;
};

export function parseWideCSV(raw: string): DataPoint[] {
	const lines = raw.trim().split('\n');
	const headers = lines[0].split(',');
	const dataRow = lines[1].split(',');

	const points: DataPoint[] = [];

	for (let i = 4; i < headers.length; i++) {
		const rawTs = headers[i].replace(' GMT-0500 (hora estándar de Colombia)', '').trim();
		const value = parseInt(dataRow[i]);

		if (!isNaN(value)) {
			points.push({
				timestamp: new Date(rawTs),
				value,
			});
		}
	}

	return points;
}