import { motion } from 'framer-motion';
import { Share2, Download, Info, CheckCircle2 } from 'lucide-react';

const ExplainableAI = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-medical-primary">Explainable AI (XAI)</h1>
                    <p className="text-medical-muted font-medium mt-1">Interpreting ResNet50 model focus using Grad-CAM heatmaps</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary text-sm flex items-center gap-2">
                        <Download size={16} /> Export Report
                    </button>
                    <button className="btn-primary text-sm flex items-center gap-2">
                        <Share2 size={16} /> Share Result
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-medical-primary">Original X-ray</h3>
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full font-bold">RAW INPUT</span>
                    </div>
                    <div className="aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs text-center p-8 uppercase font-bold tracking-widest leading-loose">
                            Hand X-Ray Image Visualization Frame
                        </div>
                        {/* Placeholder for real image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <p className="text-xs text-medical-muted mt-4 leading-relaxed font-medium"> Input resolution normalized to 512×512 for optimal feature extraction.</p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-medical-primary">Grad-CAM Heatmap</h3>
                        <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-bold">AI FOCUS</span>
                    </div>
                    <div className="aspect-[3/4] bg-medical-primary rounded-lg overflow-hidden relative flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-orange-500 to-transparent"></div>
                        <div className="z-10 text-white/50 text-[10px] uppercase font-bold text-center spacing tracking-tighter">Heatmap Layer Activated</div>
                    </div>
                    <p className="text-xs text-medical-muted mt-4 leading-relaxed font-medium">Colors indicate areas that most influenced the model's prediction.</p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-medical-primary">Fused Overlay</h3>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">INTERPRETATION</span>
                    </div>
                    <div className="aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden relative flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-orange-500 to-transparent"></div>
                        <div className="z-10 text-white/30 text-[10px] uppercase font-bold text-center spacing tracking-widest">Final Overlay View</div>
                    </div>
                    <p className="text-xs text-medical-muted mt-4 leading-relaxed font-medium">Combined view for clinical verification of ossification centers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="text-medical-primary" size={24} />
                        <h3 className="text-lg font-bold text-medical-primary tracking-tight">Model Focus Areas</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4">
                        {[
                            { label: 'Wrist Joint', score: 'HIGH Focus' },
                            { label: 'Distal Radius', score: 'HIGH Focus' },
                            { label: 'Ulnar Epiphysis', score: 'MEDIUM Focus' },
                            { label: 'Finger Growth Plates', score: 'CRITICAL Focus' },
                            { label: 'Metacarpal Caps', score: 'MEDIUM Focus' },
                            { label: 'Carpal Center', score: 'LOW Focus' }
                        ].map((area, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-teal-500" />
                                <div>
                                    <p className="text-sm font-semibold text-medical-text">{area.label}</p>
                                    <p className="text-[10px] font-bold text-medical-muted uppercase">{area.score}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card bg-medical-background border-none">
                    <h3 className="text-lg font-bold text-medical-primary mb-4 tracking-tight">Technical Reasoning</h3>
                    <p className="text-sm text-medical-text leading-loose">
                        The ResNet50 model utilizes deep feature maps to detect micro-variations in bone opacity and geometry.
                        Grad-CAM (Gradient-weighted Class Activation Mapping) extracts the gradients of any target concept,
                        flowing into the final convolutional layer to produce a localization map highlighting the important
                        regions in the image for predicting the concept.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <div className="bg-white p-3 rounded-xl flex-1 border border-slate-100">
                            <p className="text-2xl font-black text-medical-primary">7.2ms</p>
                            <p className="text-[10px] font-bold text-medical-muted uppercase tracking-widest">XAI LATENCY</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl flex-1 border border-slate-100">
                            <p className="text-2xl font-black text-medical-primary">32</p>
                            <p className="text-[10px] font-bold text-medical-muted uppercase tracking-widest">ACTIVATION MAPS</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplainableAI;
