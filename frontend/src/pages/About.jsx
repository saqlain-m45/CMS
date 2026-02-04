// frontend/src/pages/About.jsx
import { CheckCircle } from 'lucide-react';

const About = () => {
    return (
        <div className="pt-24 pb-20">
            {/* Header */}
            <div className="container mx-auto px-6 text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">About Our Mission</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    We are dedicated to transforming education through technology, making management seamless and learning accessible.
                </p>
            </div>

            {/* Two Column Section */}
            <div className="container mx-auto px-6 mb-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                            alt="Team working"
                            className="rounded-2xl shadow-xl w-full"
                        />
                    </div>
                    <div className="order-1 md:order-2 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Driving Innovation in Education</h2>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Founded in 2024, CMS started with a simple idea: Educators should spend more time teaching and less time managing paperwork. Today, we serve institutions helping them automate attendance, grading, and scheduling.
                        </p>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Our platform is built with the latest technology to ensure security, speed, and reliability. We believe in user-centric design that requires zero training to get started.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Real-time Sync', 'Secure Data', 'Cloud Based', '24/7 Support'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 justify-center md:justify-start">
                                    <CheckCircle size={20} className="text-indigo-600" />
                                    <span className="font-medium text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-900 py-16 text-white text-center">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-bold text-indigo-400 mb-2">50+</div>
                            <div className="text-gray-400">Institutions</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-400 mb-2">10k+</div>
                            <div className="text-gray-400">Students</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-emerald-400 mb-2">500+</div>
                            <div className="text-gray-400">Teachers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-400 mb-2">99%</div>
                            <div className="text-gray-400">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
