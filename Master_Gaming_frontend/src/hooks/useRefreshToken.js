import axios from 'axios';
import useAuth from './useAuth';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from '../api/axios';

const useRefreshToken = () => {
    const { auth, setAuth, checked, setChecked } = useAuth();

    const refresh = async () => {
        if (checked) {
            return auth?.accessToken || null;
        }

        try {
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

            setChecked(true);

            return response.data.accessToken;
        } catch (err) {
            setChecked(true);
            return null;
        }
    };
    return refresh;
};

export default useRefreshToken;