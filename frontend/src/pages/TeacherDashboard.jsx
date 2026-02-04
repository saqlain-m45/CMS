// frontend/src/pages/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ClipboardList, BookOpen, LogOut, CheckSquare, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const { user, api, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('attendance');

    const [mySubjects, setMySubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState([]);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/teacher.php?action=my_subjects');
            setMySubjects(res.data);
            if (res.data.length > 0) setSelectedSubject(res.data[0].id);
        } catch (error) { console.error("Error fetching subjects"); }
    };

    useEffect(() => {
        if (selectedSubject) fetchEnrolledStudents();
    }, [selectedSubject, activeTab]); // Refresh when tab changes too (to get latest marks)

    const fetchEnrolledStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/teacher.php?action=enrolled_students&subject_id=${selectedSubject}`);
            // Backend now returns 'marks' object inside student
            // We map it to local state: { mid: val, final: val ... }
            const mapped = res.data.map(s => ({
                ...s,
                mid: s.marks?.['Mid Term'] || '',
                final: s.marks?.['Final Term'] || '',
                quiz: s.marks?.['Quiz'] || '',
                assignment: s.marks?.['Assignment'] || ''
            }));
            setEnrolledStudents(mapped);
        } catch (error) { console.error("Error fetching students"); }
        finally { setLoading(false); }
    };

    const handleAttendanceSubmit = async () => {
        const records = enrolledStudents.map(s => ({
            student_id: s.id,
            status: document.getElementById(`attendance-${s.id}`).value
        }));

        try {
            await api.post('/teacher.php?action=attendance', {
                subject_id: selectedSubject,
                date,
                records
            });
            alert('Attendance Saved');
        } catch (error) {
            alert('Failed to save attendance');
        }
    };

    const handleInput = (id, field, value) => {
        setEnrolledStudents(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const handleMarksSubmit = async () => {
        // Flatten data for backend
        let records = [];
        enrolledStudents.forEach(s => {
            if (s.mid !== '') records.push({ student_id: s.id, exam_type: 'Mid Term', marks_obtained: s.mid, total_marks: 25 });
            if (s.final !== '') records.push({ student_id: s.id, exam_type: 'Final Term', marks_obtained: s.final, total_marks: 50 });
            if (s.quiz !== '') records.push({ student_id: s.id, exam_type: 'Quiz', marks_obtained: s.quiz, total_marks: 10 });
            if (s.assignment !== '') records.push({ student_id: s.id, exam_type: 'Assignment', marks_obtained: s.assignment, total_marks: 15 });
        });

        try {
            await api.post('/teacher.php?action=marks', {
                subject_id: selectedSubject,
                records
            });
            alert('Marks Uploaded Successfully');
        } catch (error) {
            alert('Failed to upload marks');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="dashboard-layout bg-gray-100 flex">
            <div className="sidebar bg-slate-900 text-white w-64 hidden md:flex flex-col h-screen fixed">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold tracking-wider text-indigo-400">TEACHER</h2>
                    <p className="text-gray-400 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{user.username}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('attendance')} className={`w-full sidebar-link ${activeTab === 'attendance' ? 'active' : ''}`}>
                        <CheckSquare size={20} /> Attendance
                    </button>
                    <button onClick={() => setActiveTab('marks')} className={`w-full sidebar-link ${activeTab === 'marks' ? 'active' : ''}`}>
                        <ClipboardList size={20} /> Marks Entry
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="main-content flex-1 p-8 md:ml-64 bg-gray-50 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 capitalize">{activeTab} Management</h1>
                </header>

                {/* Subject Selector */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="form-label">Select Course</label>
                            <select
                                className="form-input"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                {mySubjects.length === 0 && <option>No courses assigned</option>}
                                {mySubjects.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                            </select>
                        </div>
                        {activeTab === 'attendance' && (
                            <div className="w-full md:w-1/3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        )}
                        {/* No Marks inputs in header anymore */}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {enrolledStudents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No students enrolled in this course yet.</div>
                    ) : (
                        <>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b text-sm">
                                    <tr>
                                        <th className="p-4">Student Name</th>
                                        <th className="p-4">Reg No</th>
                                        {activeTab === 'attendance' ? (
                                            <th className="p-4">Status</th>
                                        ) : (
                                            <>
                                                <th className="p-4">Mid Term (25)</th>
                                                <th className="p-4">Final (50)</th>
                                                <th className="p-4">Quiz (10)</th>
                                                <th className="p-4">Assign (15)</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolledStudents.map(student => (
                                        <tr key={student.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 font-medium">{student.name}</td>
                                            <td className="p-4 text-gray-500 font-mono text-sm">{student.username}</td>

                                            {activeTab === 'attendance' ? (
                                                <td className="p-4">
                                                    <select id={`attendance-${student.id}`} className="form-input w-32 py-1">
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent</option>
                                                        <option value="Late">Late</option>
                                                    </select>
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="p-4">
                                                        <input type="number" className="form-input w-20 py-1" placeholder="-" max="25"
                                                            value={student.mid} onChange={(e) => handleInput(student.id, 'mid', e.target.value)} />
                                                    </td>
                                                    <td className="p-4">
                                                        <input type="number" className="form-input w-20 py-1" placeholder="-" max="50"
                                                            value={student.final} onChange={(e) => handleInput(student.id, 'final', e.target.value)} />
                                                    </td>
                                                    <td className="p-4">
                                                        <input type="number" className="form-input w-20 py-1" placeholder="-" max="10"
                                                            value={student.quiz} onChange={(e) => handleInput(student.id, 'quiz', e.target.value)} />
                                                    </td>
                                                    <td className="p-4">
                                                        <input type="number" className="form-input w-20 py-1" placeholder="-" max="15"
                                                            value={student.assignment} onChange={(e) => handleInput(student.id, 'assignment', e.target.value)} />
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 border-t bg-gray-50">
                                <button
                                    onClick={activeTab === 'attendance' ? handleAttendanceSubmit : handleMarksSubmit}
                                    className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> {activeTab === 'attendance' ? 'Save Attendance' : 'Save Marks'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
