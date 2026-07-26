'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface AdCodeProps {
  ad: {
    id: string;
    name: string;
    type: string;
    code: string;
  };
}

export function AdCode({ ad }: AdCodeProps) {
  const [copied, setCopied] = useState(false);

  const getScriptCode = (adId: string) => {
    // Production ortamında gerçek domain kullanılmalı
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    return `
<!-- ${ad.name} Reklam Kodu - Tip: ${ad.type} -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/api/serve/${adId}';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  })();
</script>
<div id="ad-${adId}"></div>
    `.trim();
  };

  const copyToClipboard = async () => {
    const code = getScriptCode(ad.id);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Reklam kodu kopyalandı!');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Kopyalama başarısız');
    }
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-white font-semibold">{ad.name}</h3>
          <p className="text-sm text-dark-400">
            Tip: {ad.type === 'banner' ? 'Banner' : ad.type === 'popunder' ? 'Popunder' : 'Native'}
          </p>
        </div>
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {copied ? '✓ Kopyalandı!' : '📋 Kodu Kopyala'}
        </button>
      </div>
      <div className="mt-4 p-4 bg-dark-950 rounded-lg overflow-x-auto">
        <pre className="text-xs text-dark-300 font-mono whitespace-pre-wrap">
          {getScriptCode(ad.id)}
        </pre>
      </div>
    </div>
  );
}
