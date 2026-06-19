import { NavLink } from 'react-router-dom';
import {
    Home,
    UploadCloud,
    BarChart2,
    Activity,
    Brain,
    History,
    Users,
    Bone
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { title: 'Dashboard', icon: Home, path: '/' },
        { title: 'Predict Bone Age', icon: UploadCloud, path: '/predict' },
        { title: 'Dataset Analytics', icon: BarChart2, path: '/analytics' },
        { title: 'Model Performance', icon: Activity, path: '/performance' },
        { title: 'Explainable AI', icon: Brain, path: '/xai' },
        { title: 'Prediction History', icon: History, path: '/history' },
        { title: 'About Team', icon: Users, path: '/about' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-medical-primary p-2 rounded-lg text-white">
                    <Bone size={24} />
                </div>
                <span className="text-xl font-bold text-medical-primary tracking-tight">Epiphyse</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "nav-item-active" : "nav-item"
                        }
                    >
                        <item.icon size={20} />
                        <span className="text-sm tracking-wide">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-medical-background p-4 rounded-xl">
                    <p className="text-xs text-medical-muted mb-1 uppercase tracking-widest font-bold">Model Version</p>
                    <p className="text-sm font-semibold text-medical-primary">v2.4.0 (ResNet50)</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
