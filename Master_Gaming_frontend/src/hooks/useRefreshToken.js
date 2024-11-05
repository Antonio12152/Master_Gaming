import axios from 'axios';
import useAuth from './useAuth';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../api/axios';

const useRefreshToken = () => {
    const { setAuth, setChecked } = useAuth();

    const refresh = async () => {

        // if (checked) {
        //     return auth?.accessToken || null;
        // }

        try {
            const response = await axios.post(`${BASE_URL}/updateAccessToken`, {}, {
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

            setChecked(true);

            return response.data.accessToken;
        } catch (err) {
            console.error('Error refreshing access token:', err.message);
            setChecked(true);
            return null;
        }
    };

    return refresh; // Возвращаем функцию обновления токена
};

export default useRefreshToken;
