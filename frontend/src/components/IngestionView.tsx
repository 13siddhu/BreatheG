import { useState } from 'react';

export default function IngestionView() {
  const [sapFile, setSapFile] = useState<File | null>(null);
  const [utilityFile, setUtilityFile] = useState<File | null>(null);
  const [concurJson, setConcurJson] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleUpload = async (file: File | null, endpoint: string, sourceName: string) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ingest/${endpoint}/`, {
        method: 'POST',
        body: formData
      });
      if(res.ok) {
        showMessage(`${sourceName} Data ingested successfully!`, 'success');
        if (endpoint === 'sap') setSapFile(null);
        if (endpoint === 'utility') setUtilityFile(null);
      } else {
        showMessage(`Error ingesting ${sourceName} Data.`, 'error');
      }
    } catch(err) {
      showMessage('Network error. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConcurSync = async () => {
    if (!concurJson) return;
    setLoading(true);
    try {
      JSON.parse(concurJson);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ingest/concur/`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: concurJson
      });
      if(res.ok) {
        showMessage('Concur Data synced successfully!', 'success');
        setConcurJson('');
      } else {
        showMessage('Backend rejected the payload.', 'error');
      }
    } catch(err: any) {
      if (err instanceof SyntaxError) {
        showMessage('Invalid JSON format.', 'error');
      } else {
        showMessage('Network error. Is the backend running?', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        } animate-in slide-in-from-top-2 fade-in`}>
          <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SAP Card */}
        <div className="premium-card p-6 flex flex-col h-full group">
          <div className="mb-6 flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">CSV Import</span>
          </div>
          <h3 className="text-xl font-medium mb-2 text-white group-hover:text-blue-400 transition-colors">SAP S/4HANA</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Upload fuel & procurement extracts from standard ALV Grid reports.</p>
          
          <div className="bg-[#12121A] p-4 rounded-xl border border-white/5 mb-4">
            <input 
              type="file" accept=".csv" className="premium-input text-sm w-full"
              onChange={(e) => setSapFile(e.target.files?.[0] || null)}
            />
          </div>
          <button 
            onClick={() => handleUpload(sapFile, 'sap', 'SAP')}
            disabled={!sapFile || loading} 
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Upload SAP Data'}
          </button>
        </div>

        {/* Utility Card */}
        <div className="premium-card p-6 flex flex-col h-full group">
          <div className="mb-6 flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400 bg-green-400/10 px-3 py-1 rounded-full">CSV Import</span>
          </div>
          <h3 className="text-xl font-medium mb-2 text-white group-hover:text-green-400 transition-colors">Utility Portal</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">Upload standard PG&E Green Button interval data files.</p>
          
          <div className="bg-[#12121A] p-4 rounded-xl border border-white/5 mb-4">
            <input 
              type="file" accept=".csv" className="premium-input text-sm w-full"
              onChange={(e) => setUtilityFile(e.target.files?.[0] || null)}
            />
          </div>
          <button 
            onClick={() => handleUpload(utilityFile, 'utility', 'Utility')}
            disabled={!utilityFile || loading} 
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
          >
            {loading ? 'Processing...' : 'Upload Utility Data'}
          </button>
        </div>

        {/* Concur Card */}
        <div className="premium-card p-6 flex flex-col h-full group md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">API Sync</span>
          </div>
          <h3 className="text-xl font-medium mb-2 text-white group-hover:text-purple-400 transition-colors">Concur Travel API (Manual JSON Test)</h3>
          <p className="text-gray-400 text-sm mb-6">Paste the raw JSON payload simulating a webhook push from Concur v4 API.</p>
          
          <textarea
            className="premium-input font-mono text-sm h-48 mb-4 bg-black/40 resize-y"
            placeholder='{ "Itinerary": { ... } }'
            value={concurJson}
            onChange={(e) => setConcurJson(e.target.value)}
          ></textarea>
          
          <div className="flex justify-end">
            <button 
              onClick={handleConcurSync}
              disabled={!concurJson || loading} 
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Syncing...' : 'Simulate Webhook Post'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
