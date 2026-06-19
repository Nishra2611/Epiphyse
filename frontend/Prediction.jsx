import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ShieldCheck, Clock, Layers, Zap } from 'lucide-react';

const Prediction = () => {
    const [file, setFile] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(URL.createObjectURL(uploadedFile));
        }
    };

    const runPrediction = () => {
        setIsPredicting(true);
        // Simulate API call
        setTimeout(() => {
            setResult({
                boneAge: 132,
                equivalentAge: "11 Years",
                confidence: 94.2
            });
            setIsPredicting(false);
        }, 2500);
    };

    const reset = () => {
        setFile(null);
        setResult(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-medical-primary">Bone Age Prediction</h1>
                    <p className="text-medical-muted font-medium mt-1">Upload a hand X-ray to estimate patient bone age</p>
                </div>
                {file && (
                    <button onClick={reset} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                        <X size={16} /> Reset
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Column */}
                <div className="space-y-6">
                    <div className={`card overflow-hidden transition-all border-2 border-dashed ${file ? 'border-medical-primary' : 'border-slate-200'} min-h-[500px] flex flex-col`}>
                        {!file ? (
                            <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group">
                                <div className="w-24 h-24 bg-medical-background rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Upload className="text-medical-primary" size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-medical-primary mb-2">Drag Hand X-ray Here</h3>
                                <p className="text-medical-muted text-sm px-12 text-center">Supported formats: PNG, JPG (Max 20MB)</p>
                                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                            </label>
                        ) : (
                            <div className="relative flex-1 bg-medical-background flex items-center justify-center p-4">
                                <img src={file} alt="Preview" className="max-h-full max-w-full rounded-lg shadow-2xl" />
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-4">Patient Parameters</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-medical-muted block mb-2 uppercase">Biological Gender</label>
                                <div className="flex gap-4">
                                    {['Male', 'Female'].map((gender) => (
                                        <label key={gender} className="flex-1 cursor-pointer">
                                            <input type="radio" name="gender" className="hidden peer" defaultChecked={gender === 'Male'} />
                                            <div className="py-3 text-center border border-slate-200 rounded-xl font-bold text-sm peer-checked:border-medical-primary peer-checked:bg-medical-background peer-checked:text-medical-primary hover:bg-slate-50 transition-all">
                                                {gender}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            disabled={!file || isPredicting}
                            onClick={runPrediction}
                            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${!file || isPredicting ? 'bg-slate-100 text-slate-400' : 'bg-medical-primary text-white hover:bg-opacity-90 shadow-lg shadow-blue-900/10 active:scale-[0.98]'
                                }`}
                        >
                            {isPredicting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing X-ray...
                                </>
                            ) : (
                                <>
                                    <Zap size={20} fill="currentColor" />
                                    Predict Bone Age
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Column */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="card min-h-[600px] flex flex-col items-center justify-center text-center p-12 border-none bg-slate-50"
                            >
                                <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mb-6 mb-8">
                                    <Clock className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2">No Prediction Result</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                    Upload an image and run the model to see deep learning based estimation results.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="card bg-gradient-to-br from-medical-primary to-blue-900 text-white border-none">
                                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Primary Result</h2>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black">{result.boneAge}</span>
                                        <span className="text-2xl font-bold opacity-80">Months</span>
                                    </div>
                                    <div className="mt-8 flex gap-8 items-center border-t border-white/10 pt-6">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-60">Approx. Age</p>
                                            <p className="text-xl font-bold">{result.equivalentAge}</p>
                                        </div>
                                        <div className="h-10 w-[1px] bg-white/10"></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-60">Model Confidence</p>
                                            <p className="text-xl font-bold">{result.confidence}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="card">
                                        <ShieldCheck className="text-teal-500 mb-3" size={24} />
                                        <h4 className="text-xs font-bold text-medical-muted uppercase tracking-wider mb-1">Quality Score</h4>
                                        <p className="text-2xl font-black text-medical-primary">EXCELLENT</p>
                                    </div>
                                    <div className="card">
                                        <Layers className="text-orange-500 mb-3" size={24} />
                                        <h4 className="text-xs font-bold text-medical-muted uppercase tracking-wider mb-1">Feature Match</h4>
                                        <p className="text-2xl font-black text-medical-primary">98.2%</p>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="text-sm font-bold text-medical-primary uppercase tracking-wider mb-6">Expert Interpretation</h3>
                                    <div className="space-y-4">
                                        <p className="text-sm leading-relaxed text-medical-text">
                                            The ResNet50 model identified advanced ossification centers in the distal radius and ulna, consistent with the predicted bone age of 11 years.
                                        </p>
                                        <div className="bg-medical-background p-4 rounded-xl border-l-4 border-medical-primary">
                                            <p className="text-[10px] font-black text-medical-primary uppercase mb-1">Suggested Follow-up</p>
                                            <p className="text-xs font-semibold text-medical-text">Monitor growth velocity over next 6 months to ensure percentile tracking.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
