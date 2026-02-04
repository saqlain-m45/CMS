// frontend/src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Hide Navbar on dashboard routes
  const hideNavbar = ['/admin-dashboard', '/teacher-dashboard', '/student-dashboard'].includes(location.pathname);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}-dashboard`} />} />

        <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/teacher-dashboard" element={user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />} />
        <Route path="/student-dashboard" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
      </Routes>
      {!hideNavbar && <Footer />}
      <Chatbot />
    </div>
  );
}

export default App;

