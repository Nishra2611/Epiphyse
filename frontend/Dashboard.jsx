import { motion } from 'framer-motion';
import { Image as ImageIcon, Crosshair, Zap, Activity, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
    { name: 'Mon', predictions: 45 },
    { name: 'Tue', predictions: 52 },
    { name: 'Wed', predictions: 38 },
    { name: 'Thu', predictions: 65 },
    { name: 'Fri', predictions: 48 },
    { name: 'Sat', predictions: 24 },
    { name: 'Sun', predictions: 18 },
];

const StatCard = ({ title, value, sub, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="card group cursor-pointer"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12% ↑</span>
        </div>
        <h3 className="text-4xl font-bold text-medical-primary mb-1">{value}</h3>
        <p className="text-sm font-semibold text-medical-text">{title}</p>
        <p className="text-xs text-medical-muted mt-2">{sub}</p>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-medical-primary to-medical-secondary p-12 rounded-3xl text-white shadow-2xl"
            >
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">Epiphyse AI</h1>
                    <p className="text-xl opacity-90 font-light leading-relaxed mb-8">
                        Next-generation automated bone age estimation using deep residual networks.
                        Optimized for accuracy, speed, and explainability.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-white text-medical-primary px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2">
                            <ImageIcon size={20} />
                            New Prediction
                        </button>
                        <button className="bg-medical-secondary bg-opacity-20 border border-white/20 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                            Documentation
                        </button>
                    </div>
                </div>
                {/* Abstract background blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400 opacity-10 rounded-full mr-12 mb-12 blur-2xl"></div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Dataset Size"
                    value="12,611"
                    sub="Verified X-ray Images"
                    icon={ImageIcon}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Prediction Accuracy"
                    value="94.2%"
                    sub="Overall Model Precision"
                    icon={Crosshair}
                    color="bg-teal-500"
                />
                <StatCard
                    title="Validation MAE"
                    value="7.24"
                    sub="Months of deviation"
                    icon={Activity}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Model Architecture"
                    value="ResNet50"
                    sub="Deep Residual Network"
                    icon={Brain}
                    color="bg-purple-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-medical-primary">Activity Overview</h2>
                            <p className="text-xs text-medical-muted">Weekly prediction volume across departments</p>
                        </div>
                        <select className="bg-medical-background text-xs font-bold px-3 py-2 rounded-lg border-none outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#003B73" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#003B73" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="predictions" stroke="#003B73" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-bold text-medical-primary mb-6">Workflow Status</h2>
                    <div className="space-y-6">
                        {[
                            { label: 'X-ray Upload', status: 'Optimal', color: 'bg-green-500' },
                            { label: 'Preprocessing', status: 'Optimal', color: 'bg-green-500' },
                            { label: 'ResNet50 Pipeline', status: 'Processing', color: 'bg-blue-500' },
                            { label: 'Result Rendering', status: 'Queued', color: 'bg-yellow-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{item.label}</p>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '80%' }}
                                            transition={{ delay: i * 0.2 }}
                                            className={`h-full ${item.color}`}
                                        ></motion.div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold uppercase text-medical-muted">{item.status}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 btn-secondary text-sm">
                        View Real-time Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
