// frontend/src/components/Footer.jsx
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                CMS
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Empowering educational institutions with next-generation management tools. Streamline, organize, and succeed.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-indigo-600 transition-colors"><Github size={20} /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-blue-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-blue-600 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="/login" className="hover:text-white transition-colors">Portal Login</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Services</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Student Management</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Course Scheduling</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Faculty Administration</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Performance Tracking</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-indigo-500 mt-1 shrink-0" />
                                <span>123 Education Lane, Knowledge City, Academic State 90210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-indigo-500 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-indigo-500 shrink-0" />
                                <span>support@cms-edu.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>© 2024 College Management System. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
