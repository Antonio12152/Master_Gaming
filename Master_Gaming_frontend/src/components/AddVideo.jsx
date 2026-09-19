import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddVideo = ({ onAdded }) => {
    const axiosPrivate = useAxiosPrivate();
    const [title, setTitle] = useState('');
    const [video, setVideo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axiosPrivate.post('/videos', { title, video });
            onAdded(response.data);
            setTitle('');
            setVideo('');
        } catch (err) {
            setError(err.response?.data?.err || 'Unable to add video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="video-add-form">
            <h2>Add Video</h2>
            {error && <p className="error" role="alert">{error}</p>}
            <label htmlFor="video-title">Title:</label>
            <input id="video-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            <label htmlFor="video-url">YouTube embed URL:</label>
            <input id="video-url" type="url" value={video} onChange={(event) => setVideo(event.target.value)} required />
            <button disabled={loading || !title.trim() || !video.trim()}>{loading ? 'Adding...' : 'Add Video'}</button>
        </form>
    );
};

export default AddVideo;