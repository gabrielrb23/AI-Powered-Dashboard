'use client';

import { useEffect, useState } from 'react';
import TimelineChart from '@/components/TimelineChart';
import MetricCard from '@/components/MetricCard';
import ChatBot from '@/components/Chatbot';
import { Stats } from '@/lib/metrics';

type DataPoint = { timestamp: string; value: number };

export default function Dashboard() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(({ data, stats }) => {
        setData(data);
        setStats(stats);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white text-xl">Cargando datos...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛒</span>
          <div>
            <h1 className="text-3xl font-bold text-orange-500">Rappi Store Availability</h1>
            <p className="text-gray-400 text-sm">01 Feb 2026 · Monitoreo en tiempo real</p>
          </div>
        </div>

        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Máximo de tiendas" value={stats.max.toLocaleString()} sub={`a las ${stats.maxTimestamp}`} color="green" />
            <MetricCard label="Mínimo de tiendas" value={stats.min.toLocaleString()} sub={`a las ${stats.minTimestamp}`} color="red" />
            <MetricCard label="Promedio global" value={stats.avg.toLocaleString()} sub="tiendas activas" color="orange" />
            <MetricCard label="Hora pico" value={stats.peakHour} sub={`${stats.bigDrops.length} bajones detectados`} color="blue" />
          </div>
        )}

        {/* Chart */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Tiendas visibles en el tiempo</h2>
          <TimelineChart data={data} />
        </div>

        {/* Chatbot */}
        {stats && <ChatBot stats={stats} />}
      </div>
    </main>
  );
}