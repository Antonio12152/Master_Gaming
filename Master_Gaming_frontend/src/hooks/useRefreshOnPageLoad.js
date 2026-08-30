import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useRefreshOnPageLoad = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyToken = async () => {
            if (!auth?.accessToken) {
                try {
                    await refresh();
                } catch (_error) {
                    // Anonymous users do not have a refresh cookie; this should not break the app.
                }
            }
        };
        verifyToken();
    }, [auth, refresh]);
};

export default useRefreshOnPageLoad;
