type Props = {
	label: string;
	value: string;
	sub: string;
	color: 'green' | 'red' | 'orange' | 'blue';
};

const colors = {
	green: 'text-green-400',
	red: 'text-red-400',
	orange: 'text-orange-400',
	blue: 'text-blue-400',
};

export default function MetricCard({ label, value, sub, color }: Props) {
	return (
		<div className="bg-gray-900 rounded-2xl p-5 flex flex-col gap-1">
			<span className="text-gray-400 text-sm">{label}</span>
			<span className={`text-3xl font-bold ${colors[color]}`}>{value}</span>
			<span className="text-gray-500 text-xs">{sub}</span>
		</div>
	);
}