import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Stats } from '@/lib/metrics';

const client = new Anthropic();

export async function POST(req: Request) {
	try {
		const { message, stats }: { message: string; stats: Stats } = await req.json();

		const response = await client.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 400,
			system: `Eres un analista de disponibilidad de tiendas Rappi. 
Tienes acceso a datos de monitoreo del 01/02/2026 entre las 06:11 y las 08:00 hora Colombia.
La métrica es "synthetic_monitoring_visible_stores": cuántas tiendas están visibles/activas en cada momento.

Estadísticas del período:
- Total de puntos de datos: ${stats.totalPoints}
- Mínimo de tiendas activas: ${stats.min} (a las ${stats.minTimestamp})
- Máximo de tiendas activas: ${stats.max} (a las ${stats.maxTimestamp})
- Promedio global: ${stats.avg} tiendas
- Hora pico: ${stats.peakHour}
- Bajones detectados (caídas > 500 tiendas en 10s): ${JSON.stringify(stats.bigDrops)}

Responde en español, de forma concisa y con datos precisos. 
Si te preguntan algo que no puedes saber con estos datos, dilo claramente.`,
			messages: [{ role: 'user', content: message }],
		});

		const reply = response.content[0];
		if (reply.type !== 'text') throw new Error('Unexpected response type');

		return NextResponse.json({ reply: reply.text });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Error en el chatbot' }, { status: 500 });
	}
}