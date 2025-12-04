import React from 'react';
import { Settings, PlayCircle } from 'lucide-react';
import { ConfigState } from '../types';

interface ConfigPanelProps {
    config: ConfigState;
    setConfig: (config: ConfigState) => void;
    onRun: () => void;
    isProcessing: boolean;
    disabled: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onRun, isProcessing, disabled }) => {
    
    const handleChange = (key: keyof ConfigState, value: string) => {
        setConfig({ ...config, [key]: Number(value) });
    };

    if (disabled) return null;

    return (
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                <Settings className="text-slate-400" size={20} />
                <h2 className="text-lg font-bold text-slate-100">Prediction Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                        Historical Plot Interval
                    </label>
                    <select 
                        value={config.plotInterval}
                        onChange={(e) => handleChange('plotInterval', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-colors outline-none"
                    >
                        <option value={1}>Last 24 Hours</option>
                        <option value={7}>Last 7 Days</option>
                        <option value={14}>Last 14 Days</option>
                        <option value={30}>Last 30 Days</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                        Forecast Horizon
                    </label>
                    <select 
                        value={config.forecastDays}
                        onChange={(e) => handleChange('forecastDays', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-colors outline-none"
                    >
                        <option value={1}>Next 24 Hours</option>
                        <option value={3}>Next 3 Days</option>
                        <option value={5}>Next 5 Days</option>
                        <option value={7}>Next 7 Days</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                        Confidence Interval
                    </label>
                    <select 
                        value={config.confidenceLevel}
                        onChange={(e) => handleChange('confidenceLevel', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-colors outline-none"
                    >
                        <option value={90}>90% Strict</option>
                        <option value={95}>95% Standard</option>
                        <option value={99}>99% Broad</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onRun}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 shadow-lg
                    ${isProcessing 
                        ? 'bg-slate-800 text-slate-500 cursor-wait border border-slate-700' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0'
                    }
                `}
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        Processing Models...
                    </>
                ) : (
                    <>
                        <PlayCircle size={24} />
                        Run Analysis & Generate Forecast
                    </>
                )}
            </button>
        </div>
    );
};

export default ConfigPanel;