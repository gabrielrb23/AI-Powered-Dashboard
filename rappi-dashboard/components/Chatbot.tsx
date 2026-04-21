'use client';

import { useState } from 'react';
import { Stats } from '@/lib/metrics';

type Message = { role: 'user' | 'bot'; text: string };

export default function ChatBot({ stats }: { stats: Stats }) {
	const [messages, setMessages] = useState<Message[]>([
		{ role: 'bot', text: '¡Hola! Pregúntame sobre la disponibilidad de tiendas Rappi del 01/02/2026.' }
	]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);

	async function send() {
		if (!input.trim() || loading) return;
		const userMsg = input.trim();
		setInput('');
		setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
		setLoading(true);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userMsg, stats }),
			});
			const { reply, error } = await res.json();
			setMessages(prev => [...prev, { role: 'bot', text: reply ?? error }]);
		} catch {
			setMessages(prev => [...prev, { role: 'bot', text: 'Error conectando con el servidor.' }]);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="bg-gray-900 rounded-2xl p-6 flex flex-col gap-4">
			<h2 className="text-lg font-semibold text-gray-200">🤖 Asistente de disponibilidad</h2>

			{/* Mensajes */}
			<div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
				{messages.map((m, i) => (
					<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
						<span className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${m.role === 'user'
								? 'bg-orange-500 text-white'
								: 'bg-gray-800 text-gray-200'
							}`}>
							{m.text}
						</span>
					</div>
				))}
				{loading && (
					<div className="flex justify-start">
						<span className="px-4 py-2 rounded-2xl text-sm bg-gray-800 text-gray-400 animate-pulse">
							Analizando...
						</span>
					</div>
				)}
			</div>

			{/* Input */}
			<div className="flex gap-2">
				<input
					className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
					placeholder="¿A qué hora hubo más tiendas activas?"
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && send()}
				/>
				<button
					onClick={send}
					disabled={loading}
					className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
				>
					Enviar
				</button>
			</div>
		</div>
	);
}