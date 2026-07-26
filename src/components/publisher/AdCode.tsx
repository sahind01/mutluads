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
    return `
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/api/serve/${adId}';
    script.async = true;
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
    <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-medium">{ad.name}</h3>
          <p className="text-sm text-dark-400">
            Tip: {ad.type === 'banner' ? 'Banner' : ad.type === 'popunder' ? 'Popunder' : 'Native'}
          </p>
        </div>
        <button
          onClick={copyToClipboard}
          className={`px-3 py-1 text-sm rounded-lg transition duration-200 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {copied ? 'Kopyalandı!' : 'Kopyala'}
        </button>
      </div>
      <div className="mt-2 p-3 bg-dark-950 rounded-lg text-xs text-dark-300 font-mono overflow-x-auto">
        {getScriptCode(ad.id)}
      </div>
    </div>
  );
}
