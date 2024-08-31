import axios from 'axios';
import useAuth from './useAuth';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../api/axios';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            if (auth?.accessToken) {
                return auth.accessToken;
            }
            const response = await axios.get(`${BASE_URL}/updateaccessnoken`, {
                withCredentials: true
            });
            const info = jwtDecode(response.data.accessToken);
            setAuth(prev => ({
                ...prev,
                user: {
                    img: response.data.img,
                    id: info.user.id,
                    name: info.user.name,
                    roles: {
                        admin: info.user.roles.admin,
                        writer: info.user.roles.writer
                    }
                },
                accessToken: response.data.accessToken
            }));
            return response.data.accessToken;
        } catch (err) {
            console.error("Failed to refresh token", err);
            return null;
        }
    };

    return refresh;
};

export default useRefreshToken;