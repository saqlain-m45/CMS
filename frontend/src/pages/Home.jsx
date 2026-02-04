// frontend/src/pages/Home.jsx
import { ArrowRight, BookOpen, Users, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section with Banner Image */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[700px]">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero.png"
                        alt="University Campus"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 gradient-mask-b-90"></div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-6 animate-fade-in backdrop-blur-sm">
                        Run Your Institution Smarter
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in drop-shadow-lg">
                        Empowering Minds, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Managed with Ease.</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed">
                        A complete college management solution for Students, Teachers, and Administrators. Experience the future of academic administration today.
                    </p>
                    <div className="flex justify-center gap-4 animate-fade-in">
                        <Link to="/login" className="btn btn-primary flex items-center gap-2 border-none shadow-indigo-500/50 shadow-lg hover:shadow-indigo-500/70">
                            Get Started <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose CMS?</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-16">Streamline your institution's workflow with our comprehensive suite of tools designed for modern education.</p>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Secure and distinct portals for Admins, Teachers, and Students to manage their respective tasks efficiently perfectly aligned with your hierarchy.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Academic Management</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Seamlessly manage classes, subjects, assignments, and attendance records in one centralized, real-time system accessible from anywhere.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Performance Tracking</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Real-time insights into student performance, grades, and progress reports for better academic outcomes and faster feedback loops.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
