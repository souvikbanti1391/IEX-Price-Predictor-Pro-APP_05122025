import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ConfigPanel from './components/ConfigPanel';
import ResultsDashboard from './components/ResultsDashboard';
import { IEXDataPoint, SimulationResult, ConfigState } from './types';
import { runSimulation } from './services/predictionEngine';

const App: React.FC = () => {
    const [data, setData] = useState<IEXDataPoint[] | null>(null);
    const [results, setResults] = useState<SimulationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [config, setConfig] = useState<ConfigState>({
        plotInterval: 7,
        forecastDays: 7,
        confidenceLevel: 95
    });

    const handleDataLoaded = (loadedData: IEXDataPoint[]) => {
        setData(loadedData);
        setResults(null); // Reset results on new file
    };

    const handleRunAnalysis = async () => {
        if (!data) return;
        
        setIsProcessing(true);
        try {
            // Add slight delay to allow UI to update and show loading state
            // also gives the "feel" of heavy computation
            await new Promise(r => setTimeout(r, 800));
            
            const simResults = await runSimulation(data, config.forecastDays, config.confidenceLevel);
            setResults(simResults);
        } catch (error) {
            console.error("Simulation failed", error);
            alert("An error occurred during analysis.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-20 text-slate-200">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-10 pb-24 px-6 relative overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-xl shadow-blue-500/20 mb-6 border border-white/10">
                            <Zap size={32} className="text-white fill-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            IEX DAM Price Predictor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pro</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            Advanced multi-model forecasting engine. Upload your IEX Market Clearing Price data to automatically identify the best performing algorithm and generate future predictions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 mb-8">
                    <FileUpload onDataLoaded={handleDataLoaded} />
                    
                    {data && (
                        <div className="mt-6 flex items-center justify-between text-sm text-slate-400 bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <div>
                                <span className="font-bold text-slate-300">Data Points:</span> {data.length.toLocaleString()}
                            </div>
                            <div>
                                <span className="font-bold text-slate-300">Date Range:</span> {data[0].date} to {data[data.length-1].date}
                            </div>
                        </div>
                    )}
                </div>

                {data && (
                    <ConfigPanel 
                        config={config} 
                        setConfig={setConfig} 
                        onRun={handleRunAnalysis}
                        isProcessing={isProcessing}
                        disabled={false}
                    />
                )}

                {results && (
                    <ResultsDashboard results={results} config={config} />
                )}
            </main>

             <footer className="text-center text-slate-600 text-sm pb-8">
                <p>© 2024 IEX Analytics. All predictions are simulated estimates.</p>
                <p className="mt-1 font-medium text-slate-500">All rights reserved @SouvikM</p>
            </footer>
        </div>
    );
};

export default App;