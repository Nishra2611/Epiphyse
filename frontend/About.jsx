import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, Mail, Code2, Database, Brain, Cpu, Server, Layout, Eye, Zap } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-black text-medical-primary mb-4 tracking-tighter uppercase italic">About Epiphyse</h1>
                <p className="text-lg text-medical-muted max-w-2xl mx-auto font-medium">
                    A pioneering intersection of pediatric radiology and advanced deep learning,
                    built to accelerate clinical workflows and improve patient care.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-medical-primary tracking-tight">The Problem Statement</h2>
                    <p className="text-medical-text leading-relaxed font-medium">
                        Manual bone age assessment is time-consuming and subject to inter-observer variability.
                        Radiologists typically compare hand X-rays to anatomical atlases (Greulich & Pyle),
                        which can take significant time per patient.
                    </p>
                    <p className="text-medical-text leading-relaxed font-medium">
                        Epiphyse automates this process using a ResNet50 model trained on the RSNA dataset,
                        providing results in seconds with human-level accuracy and full clinical explainability.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-medical-primary font-bold">
                            <Github size={20} /> Repository
                        </div>
                        <div className="flex items-center gap-2 text-medical-primary font-bold">
                            <Globe size={20} /> Paper
                        </div>
                    </div>
                </div>
                <div className="card bg-medical-primary text-white border-none p-10 h-full flex flex-col justify-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-8">Mission Statement</h3>
                    <p className="text-2xl font-light italic leading-relaxed">
                        "To bridge the gap between complex AI research and practical clinical application,
                        empowering healthcare professionals with data-driven confidence."
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-medical-primary text-center">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { name: 'React', icon: Layout, color: 'text-blue-400' },
                        { name: 'FastAPI', icon: Server, color: 'text-teal-500' },
                        { name: 'PyTorch', icon: Brain, color: 'text-orange-500' },
                        { name: 'OpenCV', icon: Eye, color: 'text-blue-600' },
                        { name: 'Vite', icon: Zap, color: 'text-yellow-500' },
                        { name: 'Tailwind', icon: Code2, color: 'text-cyan-500' },
                    ].map((tech, i) => (
                        <div key={i} className="card flex flex-col items-center justify-center p-6 hover:border-medical-primary transition-colors cursor-default">
                            <tech.icon size={32} className={`mb-3 ${tech.color}`} />
                            <span className="text-xs font-bold text-medical-text uppercase tracking-widest">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-medical-primary text-center">The Innovation Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { name: 'Mokshita Pandit', role: 'Project Lead & Radiologist', bio: 'Specialist in pediatric skeletal development and clinical validation protocols.' },
                        { name: 'Naisha Gajkandh', role: 'ML Engineer', bio: 'Focuses on deep residual network optimization and Grad-CAM implementation.' },
                        { name: 'Nishra Gajkandh', role: 'Data Scientist', bio: 'Expert in RSNA dataset preprocessing and statistical distribution analysis.' },
                        { name: 'Nishtha Patel', role: 'UX/UI Developer', bio: 'Designed the medical-grade user experience and real-time activity dashboards.' },
                    ].map((member, i) => (
                        <div key={i} className="card group hover:bg-medical-background transition-colors">
                            <div className="w-16 h-16 bg-gradient-to-br from-medical-primary to-teal-500 rounded-2xl mb-4 flex items-center justify-center text-white font-bold text-xl opacity-80 group-hover:opacity-100 transition-all">
                                {member.name.charAt(0)}
                            </div>
                            <h4 className="text-lg font-bold text-medical-primary">{member.name}</h4>
                            <p className="text-[10px] font-black text-medical-muted uppercase mb-4">{member.role}</p>
                            <p className="text-sm text-medical-text font-medium leading-relaxed mb-6">
                                {member.bio}
                            </p>
                            <div className="flex gap-3 text-medical-muted">
                                <Linkedin size={18} className="hover:text-blue-600 cursor-pointer" />
                                <Mail size={18} className="hover:text-red-500 cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
