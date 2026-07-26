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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-400">Gösterim</p>
            <p className="text-2xl font-bold text-white mt-1">
              {impressions.toLocaleString('tr-TR')}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-400">Tıklama</p>
            <p className="text-2xl font-bold text-white mt-1">
              {clicks.toLocaleString('tr-TR')}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-400">Tahmini Kazanç</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              ${earnings.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
