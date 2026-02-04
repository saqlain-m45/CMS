// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.get('/auth.php?action=check');
            if (res.data.authenticated) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth.php?action=login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const logout = async () => {
        await api.post('/auth.php?action=logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, api }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
