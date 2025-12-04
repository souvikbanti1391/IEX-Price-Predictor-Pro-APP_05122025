import React from 'react';
import { Trophy, TrendingUp, Activity, BarChart3, AlertCircle, Compass } from 'lucide-react';
import { SimulationResult, ConfigState, PredictionResult } from '../types';
import { ValidationChart, ForecastChart, MetricComparisonChart, ResidualChart } from './Charts';

interface ResultsDashboardProps {
    results: SimulationResult;
    config: ConfigState;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, config }) => {
    const bestModel = results.modelResults[results.bestModel];
    
    return (
        <div className="animate-in fade-in duration-700">
            {/* Recommendation Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white border border-blue-500/30">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="text-yellow-300 fill-yellow-300" size={24} />
                                <span className="font-bold tracking-wide uppercase text-sm opacity-90">Recommended Model</span>
                            </div>
                            <h2 className="text-4xl font-extrabold mb-4">{bestModel.modelName}</h2>
                            <p className="text-blue-100 max-w-2xl leading-relaxed text-lg">
                                This model achieved the lowest RMSE of <span className="font-bold font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">{bestModel.metrics.rmse.toFixed(4)}</span> on your dataset. 
                                Based on the analysis, your data shows <span className="font-semibold">{results.dataCharacteristics.volatility > 0.15 ? 'High' : 'Low'} Volatility</span> ({results.dataCharacteristics.volatility.toFixed(2)}) 
                                and {results.dataCharacteristics.trend > 0.001 ? 'positive' : 'stable'} trend characteristics.
                            </p>
                        </div>
                        <div className="hidden md:block text-right">
                             <div className="text-sm opacity-75 mb-1">Confidence Score</div>
                             <div className="text-3xl font-bold">{Math.min(99.9, (bestModel.metrics.r2 * 100)).toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    label="RMSE (Root Mean Sq Error)" 
                    value={bestModel.metrics.rmse.toFixed(4)} 
                    sub="Lower is better"
                    icon={<Activity className="text-blue-500" />}
                />
                <MetricCard 
                    label="Directional Accuracy" 
                    value={`${bestModel.metrics.directionalAccuracy.toFixed(1)}%`} 
                    sub="Trend prediction success"
                    icon={<Compass className="text-purple-500" />}
                />
                <MetricCard 
                    label="MAPE (Mean Abs % Error)" 
                    value={`${bestModel.metrics.mape.toFixed(2)}%`} 
                    sub="Relative error rate"
                    icon={<TrendingUp className="text-emerald-500" />}
                />
                <MetricCard 
                    label="R² Score" 
                    value={bestModel.metrics.r2.toFixed(4)} 
                    sub="Fit Quality (max 1.0)"
                    icon={<AlertCircle className="text-orange-500" />}
                />
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-slate-100">Detailed Model Comparison</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Model Name</th>
                                <th className="px-6 py-4">RMSE (₹)</th>
                                <th className="px-6 py-4">MAE (₹)</th>
                                <th className="px-6 py-4">MAPE (%)</th>
                                <th className="px-6 py-4">Dir. Accuracy (%)</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {(Object.values(results.modelResults) as PredictionResult[])
                                .sort((a,b) => a.metrics.rmse - b.metrics.rmse)
                                .map((model, idx) => (
                                <tr key={model.modelName} className={`hover:bg-slate-800/50 transition-colors ${idx === 0 ? 'bg-blue-900/10' : ''}`}>
                                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-2">
                                        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: model.color }}></div>
                                        {model.modelName}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-400">{model.metrics.rmse.toFixed(4)}</td>
                                    <td className="px-6 py-4 font-mono text-slate-400">{model.metrics.mae.toFixed(4)}</td>
                                    <td className="px-6 py-4 font-mono text-slate-400">{model.metrics.mape.toFixed(2)}%</td>
                                    <td className="px-6 py-4 font-mono text-slate-400 font-semibold">{model.metrics.directionalAccuracy.toFixed(1)}%</td>
                                    <td className="px-6 py-4">
                                        {idx === 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                                                <Trophy size={12} /> Winner
                                            </span>
                                        ) : (
                                            <span className="text-slate-600">rank {idx + 1}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ValidationChart results={results} config={config} />
                <ForecastChart results={results} config={config} />
            </div>

            <div className="mb-8">
                 <h2 className="text-xl font-bold text-slate-100 mb-4 px-2 border-l-4 border-blue-500 pl-4">Comparative Analysis</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricComparisonChart 
                        results={results} 
                        metric="rmse" 
                        title="RMSE Comparison" 
                        subtitle="Lower is better"
                        unit="₹"
                    />
                    <MetricComparisonChart 
                        results={results} 
                        metric="mae" 
                        title="MAE Comparison" 
                        subtitle="Lower is better"
                        unit="₹"
                    />
                    <MetricComparisonChart 
                        results={results} 
                        metric="mape" 
                        title="MAPE Comparison" 
                        subtitle="Lower is better"
                        unit="%"
                    />
                    <MetricComparisonChart 
                        results={results} 
                        metric="directionalAccuracy" 
                        title="Directional Accuracy" 
                        subtitle="Higher is better"
                        unit="%"
                        higherIsBetter={true}
                    />
                 </div>
            </div>

            <ResidualChart results={results} config={config} />
        </div>
    );
};

const MetricCard = ({ label, value, sub, icon }: any) => (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg flex items-start justify-between hover:border-slate-700 transition-colors">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-slate-100 mb-1">{value}</h3>
            <p className="text-xs text-slate-600">{sub}</p>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            {icon}
        </div>
    </div>
);

export default ResultsDashboard;