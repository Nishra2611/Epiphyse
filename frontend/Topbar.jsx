import { Search, Bell, Settings, User } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-4 bg-medical-background px-3 py-2 rounded-lg w-96">
                <Search size={18} className="text-medical-muted" />
                <input
                    type="text"
                    placeholder="Search records, models, analytics..."
                    className="bg-transparent border-none outline-none text-sm w-full"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="text-medical-muted hover:text-medical-primary transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
                </button>
                <button className="text-medical-muted hover:text-medical-primary transition-colors">
                    <Settings size={20} />
                </button>

                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right">
                        <p className="text-xs font-bold text-medical-primary">Dr. Sarah Wilson</p>
                        <p className="text-[10px] text-medical-muted uppercase font-bold">Chief Radiologist</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-medical-primary to-teal-500 rounded-full flex items-center justify-center text-white font-bold p-0.5">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                            <User size={20} className="text-medical-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
