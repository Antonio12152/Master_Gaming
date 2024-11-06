import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useRefreshOnPageLoad = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyToken = async () => {
            if (!auth?.accessToken) {
                await refresh();
            }
        };
        verifyToken();
    }, [auth, refresh]);
};

export default useRefreshOnPageLoad;
