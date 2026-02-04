// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, UserPlus, Layers, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, api, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const [data, setData] = useState([]);
    const [teachersList, setTeachersList] = useState([]); // For dropdown
    const [loading, setLoading] = useState(false);

    // Form States
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'student', teacher_id: '' });
    const [generatedCreds, setGeneratedCreds] = useState(null);

    // Fetch Data on Tab Change
    useEffect(() => {
        fetchData();
        if (activeTab === 'classes') fetchTeachers();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'students') {
                res = await api.get('/admin.php?action=users&role=student');
            } else if (activeTab === 'teachers') {
                res = await api.get('/admin.php?action=users&role=teacher');
            } else if (activeTab === 'classes') {
                res = await api.get('/admin.php?action=subjects'); // Changed endpoint to fetch subjects with teachers
            }
            setData(res?.data || []);
        } catch (error) {
            console.error("Fetch Data Error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/admin.php?action=teachers_list');
            setTeachersList(res.data);
        } catch (error) {
            console.error("Failed to fetch teachers");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setGeneratedCreds(null);
        try {
            if (activeTab === 'classes') {
                await api.post('/admin.php?action=subjects', {
                    name: formData.name,
                    teacher_id: formData.teacher_id
                });
                setShowModal(false);
                fetchData();
                setFormData({ name: '', email: '', role: 'student', teacher_id: '' });
            } else {
                const res = await api.post('/admin.php?action=users', { ...formData, role: activeTab === 'students' ? 'student' : 'teacher' });
                if (res.data.success) {
                    setGeneratedCreds(res.data.message);
                    setTimeout(() => {
                        setShowModal(false);
                        setGeneratedCreds(null);
                        setFormData({ name: '', email: '', role: 'student', teacher_id: '' });
                        fetchData();
                    }, 5000);
                }
            }
        } catch (error) {
            console.error("Add Error", error);
            const errMsg = error.response?.data?.error || "Failed to add Item";
            alert(errMsg);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="dashboard-layout bg-gray-100 flex">
            {/* Sidebar */}
            <div className="sidebar bg-slate-900 text-white w-64 hidden md:flex flex-col h-screen fixed">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold tracking-wider text-indigo-400">ADMIN</h2>
                    <p className="text-gray-400 text-sm">Control Panel</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('students')} className={`w-full sidebar-link ${activeTab === 'students' ? 'active' : ''}`}>
                        <Users size={20} /> Students
                    </button>
                    <button onClick={() => setActiveTab('teachers')} className={`w-full sidebar-link ${activeTab === 'teachers' ? 'active' : ''}`}>
                        <UserPlus size={20} /> Teachers
                    </button>
                    <button onClick={() => setActiveTab('classes')} className={`w-full sidebar-link ${activeTab === 'classes' ? 'active' : ''}`}>
                        <BookOpen size={20} /> Courses
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content flex-1 p-8 md:ml-64 bg-gray-50 min-h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 capitalize">Manage {activeTab === 'classes' ? 'Courses' : activeTab}</h1>
                        <p className="text-gray-500">Overview of all registered {activeTab === 'classes' ? 'courses' : activeTab}</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
                        + Add New {activeTab === 'classes' ? 'Course' : activeTab.slice(0, -1)}
                    </button>
                </header>

                {/* Content Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading data...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                                    {activeTab !== 'classes' && <th className="p-4 text-sm font-semibold text-gray-600">Username</th>}
                                    {activeTab === 'classes' && <th className="p-4 text-sm font-semibold text-gray-600">Course Code</th>}
                                    {activeTab === 'classes' && <th className="p-4 text-sm font-semibold text-gray-600">Assigned Teacher</th>}
                                    <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-900">#{item.id}</td>
                                        <td className="p-4 font-medium text-indigo-600">{item.name}</td>
                                        {activeTab !== 'classes' && <td className="p-4 font-mono text-sm text-slate-700 bg-slate-100 rounded inline-block my-2 px-2 py-1">{item.username}</td>}
                                        {activeTab === 'classes' && <td className="p-4 font-mono text-sm">{item.code}</td>}
                                        {activeTab === 'classes' && <td className="p-4 text-gray-600">{item.teacher_name || 'Unassigned'}</td>}
                                        <td className="p-4">
                                            <button className="text-sm text-red-500 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Add New {activeTab === 'classes' ? 'Course' : 'User'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        {generatedCreds ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
                                <h3 className="font-bold">Success!</h3>
                                <p>{generatedCreds}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleAdd}>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {activeTab !== 'classes' && (
                                    <div className="form-group">
                                        <label className="form-label">Email (Optional)</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                )}

                                {activeTab === 'classes' && (
                                    <div className="form-group">
                                        <label className="form-label">Assign Teacher</label>
                                        <select
                                            className="form-input"
                                            required
                                            value={formData.teacher_id}
                                            onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                                        >
                                            <option value="">Select a Teacher</option>
                                            {teachersList.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {activeTab !== 'classes' && (
                                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg mb-6">
                                        <p><strong>Note:</strong> Registration No / Username will be auto-generated.</p>
                                        <p>Default Password: <strong>12345</strong></p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
