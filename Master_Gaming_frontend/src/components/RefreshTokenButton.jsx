import React from 'react';
import useRefreshToken from '../hooks/useRefreshToken';

const RefreshTokenButton = () => {
    const refresh = useRefreshToken();

    const handleRefresh = async () => {
        const newAccessToken = await refresh();
        if (newAccessToken) {
            console.log('Access token refreshed successfully:', newAccessToken);
        } else {
            console.error('Failed to refresh access token.');
        }
    };

    return (
        <button onClick={handleRefresh}>
            Update token
        </button>
    );
};

export default RefreshTokenButton;
