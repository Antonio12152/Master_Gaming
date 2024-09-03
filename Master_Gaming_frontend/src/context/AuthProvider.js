import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { BASE_URL } from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(false);

    useEffect(() => {
        const fetchAuthData = async () => {
            try {
                await axios.get(`${BASE_URL}`);
            } catch (error) {
                setErr(true);
                console.error("Failed to fetch auth data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (err) {
        return <div>Error...</div>;
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, checked, setChecked }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
