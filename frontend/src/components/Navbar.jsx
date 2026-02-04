// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Monitor, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-white/20">
            <div className="container flex justify-between items-center h-20">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">
                        CMS<span className="text-indigo-600">.</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
                    <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium">About</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium">Contact</Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-500 capitalize">{user.role}: {user.name}</span>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Login Portal
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full animate-fade-in">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium" onClick={() => setIsOpen(false)}>Contact</Link>

                    {user ? (
                        <>
                            <span className="text-sm font-semibold text-gray-500 capitalize">{user.role}: {user.name}</span>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-2 text-red-500 font-medium">
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary text-center" onClick={() => setIsOpen(false)}>
                            Login Portal
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
