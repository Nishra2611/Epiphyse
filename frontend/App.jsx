import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Analytics from './pages/Analytics';
import ExplainableAI from './pages/ExplainableAI';
import Performance from './pages/Performance';
import History from './pages/History';
import About from './pages/About';

function App() {
    return (
        <div className="flex min-h-screen bg-medical-background">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-64">
                <Topbar />

                <main className="p-8 mt-16">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/predict" element={<Prediction />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/xai" element={<ExplainableAI />} />
                        <Route path="/performance" element={<Performance />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
