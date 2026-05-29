import React, { useState, useEffect } from 'react';

type RecordStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface NormalizedRecord {
  id: string;
  source_type: string;
  scope: string;
  activity_date: string;
  normalized_value: number;
  normalized_unit: string;
  status: RecordStatus;
}

export default function ReviewDashboard() {
  const [records, setRecords] = useState<NormalizedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/records/`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const updateStatus = async (id: string, status: RecordStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/records/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchRecords(); 
      }
    } catch(err) {
      console.error(err);
    }
  };

  const getScopeColor = (scope: string) => {
    switch(scope) {
      case 'SCOPE_1': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'SCOPE_2': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'SCOPE_3': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusBadge = (status: RecordStatus) => {
    switch(status) {
      case 'PENDING': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-yellow-400 bg-yellow-400/10 border border-yellow-400/20"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"/> Pending</span>;
      case 'APPROVED': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Approved</span>;
      case 'REJECTED': 
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20"><div className="w-1.5 h-1.5 rounded-full bg-red-400"/> Rejected</span>;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
      Loading records...
    </div>
  );

  return (
    <div className="premium-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-medium text-white mb-1">Data Pipeline Review</h3>
          <p className="text-sm text-gray-400">Total Records: {records.length}</p>
        </div>
        <button onClick={fetchRecords} className="btn-secondary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#12121A]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Scope</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Metric</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map(record => (
              <tr key={record.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <span className="font-mono text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
                    {record.id.substring(0, 8)}
                  </span>
                </td>
                <td className="p-4 font-medium text-gray-200">
                  <div className="flex items-center gap-2">
                    {record.source_type === 'SAP' && <div className="w-2 h-2 rounded-full bg-blue-400"/>}
                    {record.source_type === 'UTILITY' && <div className="w-2 h-2 rounded-full bg-green-400"/>}
                    {record.source_type === 'CONCUR' && <div className="w-2 h-2 rounded-full bg-purple-400"/>}
                    {record.source_type}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getScopeColor(record.scope)}`}>
                    {record.scope.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-gray-300 text-sm">{record.activity_date || '-'}</td>
                <td className="p-4 font-mono text-sm">
                  <span className="text-white">{record.normalized_value?.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">{record.normalized_unit}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(record.status)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => updateStatus(record.id, 'APPROVED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        record.status === 'APPROVED' 
                          ? 'bg-emerald-500/20 text-emerald-500 cursor-default' 
                          : 'bg-white/5 text-gray-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                      disabled={record.status === 'APPROVED'}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(record.id, 'REJECTED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        record.status === 'REJECTED' 
                          ? 'bg-red-500/20 text-red-500 cursor-default' 
                          : 'bg-white/5 text-gray-300 hover:bg-red-500 hover:text-white'
                      }`}
                      disabled={record.status === 'REJECTED'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-300 mb-1">No Data Available</h4>
                  <p className="text-sm text-gray-500">Go to Data Sources to upload or sync records.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
