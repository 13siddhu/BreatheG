import React, { useState } from 'react';
import './index.css';
import IngestionView from './components/IngestionView';
import ReviewDashboard from './components/ReviewDashboard';

function App() {
  const [activeTab, setActiveTab] = useState<'ingest' | 'review'>('ingest');

  return (
    <div className="min-h-screen text-white font-sans selection:bg-purple-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 tracking-tight text-gradient">
              Breathe ESG <span className="text-gradient-brand">Data Hub</span>
            </h1>
            <p className="text-lg text-gray-400 font-light">Intelligent ingestion & review pipeline for enterprise emissions</p>
          </div>
          
          <nav className="flex bg-[#12121A] p-1.5 rounded-2xl border border-white/5 shadow-xl">
            <button 
              onClick={() => setActiveTab('ingest')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'ingest' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Data Sources
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'review' 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Analyst Review
            </button>
          </nav>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'ingest' ? (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-2">Connect Sources</h2>
                <p className="text-gray-400">Securely ingest data from SAP, Utility providers, and Concur.</p>
              </div>
              <IngestionView />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-2">Review & Approve</h2>
                <p className="text-gray-400">Validate normalized records before finalizing for audit.</p>
              </div>
              <ReviewDashboard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
