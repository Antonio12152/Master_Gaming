import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
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
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
