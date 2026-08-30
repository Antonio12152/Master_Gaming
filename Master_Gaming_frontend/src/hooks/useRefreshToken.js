import axios from 'axios';
import useAuth from './useAuth';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../api/axios';

const useRefreshToken = () => {
    const { setAuth} = useAuth();
    
    const refresh = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/updateAccessToken`, {}, {
                withCredentials: true
            });

            if (!response?.data?.accessToken) {
                throw new Error('No access token returned from refresh endpoint');
            }

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
            console.error('Error refreshing access token:', err?.response?.data || err.message);
            throw err;
        }
    };

    return refresh;
};

export default useRefreshToken;
