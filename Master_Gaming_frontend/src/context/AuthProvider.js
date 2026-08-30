import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { BASE_URL } from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthData = async () => {
            try {
                await axios.get(`${BASE_URL}`);
            } catch (_error) {
                // No-op: this is just a lightweight backend availability check.
            } finally {
                setLoading(false);
            }
        };

        fetchAuthData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
