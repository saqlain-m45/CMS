// frontend/src/pages/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, BarChart2, LogOut, CheckCircle, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, api, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [attendance, setAttendance] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [marks, setMarks] = useState([]);

    useEffect(() => {
        if (activeTab === 'overview' || activeTab === 'results' || activeTab === 'attendance') fetchUserData();
        if (activeTab === 'courses') fetchAvailableCourses();
    }, [activeTab]);

    const fetchUserData = async () => {
        try {
            const attRes = await api.get('/student.php?action=attendance');
            setAttendance(attRes.data);
            const markRes = await api.get('/student.php?action=marks');
            setMarks(markRes.data);
            const coursesRes = await api.get('/student.php?action=my_courses');
            setMyCourses(coursesRes.data);
        } catch (error) { console.error("Error fetching data"); }
    };

    const fetchAvailableCourses = async () => {
        try {
            const res = await api.get('/student.php?action=available_courses');
            setAvailableCourses(res.data);
            const myRes = await api.get('/student.php?action=my_courses'); // Also refresh enrolled
            setMyCourses(myRes.data);
        } catch (error) { console.error("Error fetching courses"); }
    };

    const handleEnroll = async (subjectId) => {
        try {
            await api.post('/student.php?action=enroll', { subject_id: subjectId });
            alert("Enrolled Successfully!");
            fetchAvailableCourses(); // Refresh list associated
            fetchUserData(); // Refresh overview count
        } catch (error) {
            alert("Enrollment Failed");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const totalDays = attendance.length;
    const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    return (
        <div className="dashboard-layout bg-gray-100 flex">
            {/* Sidebar */}
            <div className="sidebar bg-slate-900 text-white w-64 hidden md:flex flex-col h-screen fixed">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold tracking-wider text-indigo-400">STUDENT</h2>
                    <p className="text-gray-400 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{user.username}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}>
                        <BarChart2 size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('courses')} className={`w-full sidebar-link ${activeTab === 'courses' ? 'active' : ''}`}>
                        <PlusCircle size={20} /> Register Courses
                    </button>
                    <button onClick={() => setActiveTab('attendance')} className={`w-full sidebar-link ${activeTab === 'attendance' ? 'active' : ''}`}>
                        <Calendar size={20} /> Attendance
                    </button>
                    <button onClick={() => setActiveTab('results')} className={`w-full sidebar-link ${activeTab === 'results' ? 'active' : ''}`}>
                        <BookOpen size={20} /> Results
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
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 capitalize">
                        {activeTab === 'overview' ? `Welcome, ${user.name.split(' ')[0]}` : activeTab}
                    </h1>
                </header>

                {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                            <p className="text-indigo-600 font-semibold mb-1">Attendance</p>
                            <h3 className="text-4xl font-bold text-slate-800">{percentage}%</h3>
                            <p className="text-sm text-gray-400 mt-1">Overall</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                            <p className="text-emerald-600 font-semibold mb-1">Enrolled Courses</p>
                            <h3 className="text-4xl font-bold text-slate-800">{myCourses.length}</h3>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="space-y-8">
                        {/* Available Courses */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Available for Registration</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {availableCourses.map(course => (
                                    <div key={course.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{course.name}</h3>
                                            <p className="text-sm text-gray-500 mb-1">Code: {course.code}</p>
                                            <p className="text-sm text-indigo-600 font-medium">Instructor: {course.teacher_name}</p>
                                        </div>
                                        <button onClick={() => handleEnroll(course.id)} className="btn btn-primary text-sm px-4 py-2">
                                            Enroll Now
                                        </button>
                                    </div>
                                ))}
                                {availableCourses.length === 0 && <p className="text-gray-500">No new courses available.</p>}
                            </div>
                        </div>

                        {/* Enrolled Courses */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">My Enrolled Courses</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {myCourses.map(course => (
                                    <div key={course.id} className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex items-center gap-4">
                                        <CheckCircle className="text-green-600" size={24} />
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{course.name}</h3>
                                            <p className="text-sm text-gray-500">{course.teacher_name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Date</th>
                                    <th className="p-4 font-semibold text-gray-600">Course</th>
                                    <th className="p-4 font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record, index) => (
                                    <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="p-4 text-gray-800">{record.date}</td>
                                        <td className="p-4 text-gray-600">{record.subject_name || record.code}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                                    record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {attendance.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-gray-400">No attendance records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Subject</th>
                                    <th className="p-4 font-semibold text-gray-600">Type</th>
                                    <th className="p-4 font-semibold text-gray-600">Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marks.map((m, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{m.subject_name}</td>
                                        <td className="p-4 text-gray-600 capitalize">{m.exam_type}</td>
                                        <td className="p-4">{m.marks_obtained} / {m.total_marks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
