import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { LayoutGrid, List } from 'lucide-react';

const ageData = [
    { name: '0-5', count: 1200 },
    { name: '5-10', count: 4500 },
    { name: '10-15', count: 5800 },
    { name: '15-20', count: 1111 },
];

const genderData = [
    { name: 'Male', value: 6500 },
    { name: 'Female', value: 6111 },
];

const COLORS = ['#003B73', '#008080'];

const Analytics = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-medical-primary">Dataset Analytics</h1>
                    <p className="text-medical-muted font-medium mt-1">Exploration of the RSNA Bone Age dataset distribution</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button className="p-2 bg-medical-background rounded-lg text-medical-primary"><LayoutGrid size={20} /></button>
                    <button className="p-2 text-medical-muted"><List size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-8">Age Group Distribution</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} label={{ value: 'Age Group (Years)', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#003B73" radius={[8, 8, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-8">Gender Distribution</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider">Sample Image Grid</h3>
                    <button className="text-xs font-bold text-medical-primary hover:underline">View All 12,611 Images</button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-medical-primary transition-all relative group">
                            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-300 group-hover:text-medical-primary transition-colors">XRAY_{1000 + i}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center py-10">
                    <p className="text-medical-muted font-bold text-xs uppercase tracking-widest mb-1">Mean Bone Age</p>
                    <p className="text-4xl font-black text-medical-primary">127.3</p>
                    <p className="text-xs text-medical-muted mt-1 font-semibold">MONTHS</p>
                </div>
                <div className="card text-center py-10">
                    <p className="text-medical-muted font-bold text-xs uppercase tracking-widest mb-1">Std Deviation</p>
                    <p className="text-4xl font-black text-medical-primary">41.2</p>
                    <p className="text-xs text-medical-muted mt-1 font-semibold">MONTHS</p>
                </div>
                <div className="card text-center py-10">
                    <p className="text-medical-muted font-bold text-xs uppercase tracking-widest mb-1">Youngest Patient</p>
                    <p className="text-4xl font-black text-medical-primary">6</p>
                    <p className="text-xs text-medical-muted mt-1 font-semibold">MONTHS</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
