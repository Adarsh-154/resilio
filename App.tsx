
import React, { useState, useEffect, useCallback } from 'react';
import { Supplier, ProjectState, RiskAnalysis, ScenarioResult } from './types';
import { SAMPLE_SUPPLIERS } from './constants';
import { analyzeSupplyChainRisk, runScenarioAnalysis } from './services/geminiService';
import SupplierForm from './components/SupplierForm';
import RiskVisuals from './components/RiskVisuals';
import ScenarioEngine from './components/ScenarioEngine';

const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>({
    suppliers: [],
    analysis: null,
    currentScenario: '',
    scenarioResult: null,
    loading: false,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'risk' | 'scenarios'>('inventory');

  const addSupplier = (supplier: Supplier) => {
    setState(prev => ({ ...prev, suppliers: [...prev.suppliers, supplier], error: null }));
  };

  const removeSupplier = (id: string) => {
    setState(prev => ({ ...prev, suppliers: prev.suppliers.filter(s => s.id !== id) }));
  };

  const clearData = () => {
    setState(prev => ({ ...prev, suppliers: [], analysis: null, scenarioResult: null, error: null }));
  };

  const loadSampleData = () => {
    setState(prev => ({ ...prev, suppliers: SAMPLE_SUPPLIERS, error: null }));
  };

  const performAnalysis = async () => {
    if (state.suppliers.length === 0) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const analysis = await analyzeSupplyChainRisk(state.suppliers);
      setState(prev => ({ ...prev, analysis, loading: false }));
      setActiveTab('risk');
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  const simulateScenario = async (scenario: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await runScenarioAnalysis(state.suppliers, scenario);
      setState(prev => ({ ...prev, scenarioResult: result, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              R
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Resilio</h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Supply Chain Architect</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              disabled={state.suppliers.length === 0 || state.loading}
              onClick={performAnalysis}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center gap-2 shadow-sm"
            >
              {state.loading && activeTab !== 'scenarios' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )}
              Run AI Diagnostics
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-slate-200 mb-8 gap-8">
          {[
            { id: 'inventory', label: '1. Configure Inventory', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
            { id: 'risk', label: '2. Risk Assessment', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
            { id: 'scenarios', label: '3. Scenario Optimization', icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M14 19l-2 1m0 0l-2-1m2 1v2.5M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-all relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
              </svg>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            </button>
          ))}
        </div>

        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-700 font-medium animate-in fade-in zoom-in duration-300">
             <div className="flex items-center gap-3">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {state.error}
             </div>
             <button onClick={() => setState(p => ({...p, error: null}))} className="text-red-400 hover:text-red-600">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SupplierForm
              suppliers={state.suppliers}
              onAdd={addSupplier}
              onRemove={removeSupplier}
              onClear={clearData}
              onLoadSample={loadSampleData}
            />
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {state.analysis ? (
              <>
                <RiskVisuals analysis={state.analysis} suppliers={state.suppliers} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       Strategic Insights
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {state.analysis.keyInsights.map((insight, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-start group hover:border-blue-300 transition-all">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-slate-600 leading-relaxed font-medium">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                       </svg>
                       High Priority Risks
                    </h3>
                    <div className="space-y-4">
                      {state.analysis.vulnerabilities.map((v, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border-l-4 border-l-red-500 border border-slate-200 shadow-sm">
                          <h4 className="font-bold text-slate-900">{v.title}</h4>
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{v.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                             <span className="text-[10px] font-extrabold uppercase tracking-tighter text-red-600 bg-red-50 px-2 py-0.5 rounded">Impact: {v.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">Please add suppliers and click "Run AI Diagnostics" above.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScenarioEngine
              onSimulate={simulateScenario}
              loading={state.loading}
              result={state.scenarioResult}
            />
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 text-center">
        <div className="bg-slate-50 rounded-xl p-8 max-w-2xl mx-auto border border-slate-200">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Project Architecture for Interviewers</h4>
          <p className="text-sm text-slate-600 leading-relaxed text-left">
            <strong>The Problem:</strong> Global supply chains are increasingly volatile. Manually identifying single points of failure is error-prone. <br/><br/>
            <strong>The Solution:</strong> Resilio leverages <strong>Gemini 3 Flash</strong> to perform logical reasoning across structured supplier data. It evaluates geographic density, category criticality, and financial exposure to generate a real-time risk index. <br/><br/>
            <strong>Analytical Logic:</strong> Unlike simple dashboards, this app uses prompt-engineered reasoning to simulate non-linear global shocks, providing actionable mitigation steps (Diversification, Buffer Stocking, Nearshoring) tailored to the specific supplier mix.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
