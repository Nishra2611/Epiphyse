import { Search, Filter, MoreHorizontal, Download, Eye } from 'lucide-react';

const historyData = [
    { id: 'REC-001', date: '18 June 2026', image: 'Patient_12.jpg', gender: 'Male', age: '132 Months', status: 'Completed' },
    { id: 'REC-002', date: '17 June 2026', image: 'Patient_84.png', gender: 'Female', age: '96 Months', status: 'Completed' },
    { id: 'REC-003', date: '17 June 2026', image: 'Patient_22.jpg', gender: 'Male', age: '156 Months', status: 'Completed' },
    { id: 'REC-004', date: '16 June 2026', image: 'Patient_09.jpg', gender: 'Male', age: '120 Months', status: 'Completed' },
    { id: 'REC-005', date: '16 June 2026', image: 'Patient_44.png', gender: 'Female', age: '74 Months', status: 'Completed' },
    { id: 'REC-006', date: '15 June 2026', image: 'Patient_101.jpg', gender: 'Female', age: '180 Months', status: 'Completed' },
];

const History = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-medical-primary">Prediction History</h1>
                    <p className="text-medical-muted font-medium mt-1">Review and manage past bone age estimations</p>
                </div>
                <button className="btn-primary text-sm flex items-center gap-2">
                    <Download size={16} /> Export All Data
                </button>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 flex items-center gap-3 bg-medical-background px-4 py-3 rounded-xl border border-slate-100">
                        <Search size={18} className="text-medical-muted" />
                        <input type="text" placeholder="Search by Record ID or Image Name..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
                    </div>
                    <button className="btn-secondary text-sm flex items-center gap-2 border-slate-200 text-medical-text">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 text-left text-xs font-bold text-medical-muted uppercase px-4">Date</th>
                                <th className="pb-4 text-left text-xs font-bold text-medical-muted uppercase px-4">Record ID</th>
                                <th className="pb-4 text-left text-xs font-bold text-medical-muted uppercase px-4">Image Name</th>
                                <th className="pb-4 text-left text-xs font-bold text-medical-muted uppercase px-4">Gender</th>
                                <th className="pb-4 text-left text-xs font-bold text-medical-muted uppercase px-4">Predicted Age</th>
                                <th className="pb-4 text-left text-xs font-bold text-medical-muted uppercase px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.map((row, i) => (
                                <tr key={i} className="group border-b border-slate-50 hover:bg-medical-background/30 transition-all">
                                    <td className="py-5 px-4">
                                        <p className="text-sm font-semibold text-medical-text">{row.date}</p>
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className="text-[10px] font-black bg-white border border-slate-200 px-2 py-1 rounded text-medical-primary uppercase">{row.id}</span>
                                    </td>
                                    <td className="py-5 px-4 font-bold text-sm text-medical-text opacity-70 group-hover:opacity-100 transition-opacity">
                                        {row.image}
                                    </td>
                                    <td className="py-5 px-4 text-sm font-medium">
                                        {row.gender}
                                    </td>
                                    <td className="py-5 px-4">
                                        <p className="text-sm font-black text-medical-primary">{row.age}</p>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-medical-muted hover:text-medical-primary transition-colors"><Eye size={18} /></button>
                                            <button className="p-2 text-medical-muted hover:text-medical-primary transition-colors"><MoreHorizontal size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-medical-primary text-white' : 'bg-slate-100 text-medical-muted hover:bg-slate-200'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
