'use client';

interface StatsOverviewProps {
  impressions: number;
  clicks: number;
  earnings: number;
}

export function StatsOverview({ impressions, clicks, earnings }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <p className="text-sm text-dark-400">Gösterim</p>
        <p className="text-2xl font-bold text-white mt-1">
          {impressions.toLocaleString('tr-TR')}
        </p>
      </div>
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <p className="text-sm text-dark-400">Tıklama</p>
        <p className="text-2xl font-bold text-white mt-1">
          {clicks.toLocaleString('tr-TR')}
        </p>
      </div>
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <p className="text-sm text-dark-400">Tahmini Kazanç</p>
        <p className="text-2xl font-bold text-yellow-400 mt-1">
          ${earnings.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
