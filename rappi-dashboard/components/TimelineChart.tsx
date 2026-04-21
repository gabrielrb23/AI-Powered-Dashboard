'use client';

import {
	LineChart, Line, XAxis, YAxis, CartesianGrid,
	Tooltip, ResponsiveContainer
} from 'recharts';

type Props = {
	data: { timestamp: string; value: number }[];
};

export default function TimelineChart({ data }: Props) {
	const sampled = data.filter((_, i) => i % 5 === 0).map(p => ({
		time: new Date(p.timestamp).toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
		}),
		tiendas: p.value,
	}));

	return (
		<ResponsiveContainer width="100%" height={350}>
			<LineChart data={sampled}>
				<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
				<XAxis
					dataKey="time"
					tick={{ fill: '#9CA3AF', fontSize: 11 }}
					interval={Math.floor(sampled.length / 8)}
				/>
				<YAxis
					tick={{ fill: '#9CA3AF', fontSize: 11 }}
					tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
				/>
				<Tooltip
					contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
					labelStyle={{ color: '#F9FAFB' }}
					formatter={(v) => [Number(v).toLocaleString(), 'Tiendas activas']} />
				<Line
					type="monotone"
					dataKey="tiendas"
					stroke="#FF441F"
					dot={false}
					strokeWidth={2}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}