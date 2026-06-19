import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Target, Cpu, TrendingUp } from 'lucide-react';

const trainingLog = [
    { epoch: 1, loss: 0.85, mae: 15.2 },
    { epoch: 10, loss: 0.42, mae: 11.5 },
    { epoch: 20, loss: 0.28, mae: 9.8 },
    { epoch: 30, loss: 0.19, mae: 8.4 },
    { epoch: 40, loss: 0.15, mae: 7.6 },
    { epoch: 50, loss: 0.12, mae: 7.24 },
];

const Performance = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-medical-primary">Model Performance</h1>
                <p className="text-medical-muted font-medium mt-1">Technical metrics and evaluation of the ResNet50 architecture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'MAE', value: '7.24', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'RMSE', value: '9.18', icon: Target, color: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'R² Score', value: '0.982', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Best Epoch', value: '48', icon: Cpu, color: 'text-orange-600', bg: 'bg-orange-50' }
                ].map((stat, i) => (
                    <div key={i} className="card">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                            <stat.icon size={20} />
                        </div>
                        <h4 className="text-[10px] font-bold text-medical-muted uppercase tracking-widest">{stat.label}</h4>
                        <p className="text-2xl font-black text-medical-primary tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-8">Training Loss Curve</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trainingLog}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="epoch" axisLine={false} tickLine={false} label={{ value: 'Epochs', position: 'insideBottom', offset: -5, fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="loss" stroke="#003B73" strokeWidth={3} dot={{ r: 4, fill: '#003B73' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-8">Validation MAE Path</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trainingLog}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="epoch" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="mae" stroke="#008080" strokeWidth={3} dot={{ r: 4, fill: '#008080' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-6">Prediction vs Ground Truth (Batch Test)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 italic">
                                <th className="py-4 text-xs font-bold text-medical-muted uppercase tracking-widest px-4">Actual (Months)</th>
                                <th className="py-4 text-xs font-bold text-medical-muted uppercase tracking-widest px-4">Predicted (Months)</th>
                                <th className="py-4 text-xs font-bold text-medical-muted uppercase tracking-widest px-4">Delta (Error)</th>
                                <th className="py-4 text-xs font-bold text-medical-muted uppercase tracking-widest px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {[
                                { actual: 120, pred: 122.4, error: '+2.4' },
                                { actual: 96, pred: 98.1, error: '+2.1' },
                                { actual: 156, pred: 152.8, error: '-3.2' },
                                { actual: 72, pred: 73.5, error: '+1.5' },
                                { actual: 180, pred: 184.2, error: '+4.2' },
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-medical-primary">{row.actual}</td>
                                    <td className="py-4 px-4 font-bold text-medical-primary">{row.pred}</td>
                                    <td className="py-4 px-4 font-bold text-red-500">{row.error}</td>
                                    <td className="py-4 px-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">ACCURATE</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Performance;
