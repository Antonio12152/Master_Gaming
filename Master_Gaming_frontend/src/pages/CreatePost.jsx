import React, { useEffect, useState } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const CreatePost = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();

    const [title, setTitle] = useState('');
    const [img, setImg] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!auth?.accessToken) {
                const newAccessToken = await refresh();
                if (newAccessToken) {
                    setToken(true);
                }
            } else {
                setToken(true);
            }
        };

        verifyToken();
    }, [auth?.accessToken, refresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosPrivate.post('/insertPost', {
                title: `${title}`, img: `${img}`, text: `${text}`, tags: `${tags}`, user: `${auth.user}`
            });

            const data = await response.text();
            if (!response.ok) {
                throw new Error(data);
            }

            alert('Post and tags inserted successfully');
            setTitle('');
            setImg('');
            setText('');
            setTags('');
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    if (!token) return (
        <div>No access, please log in.</div>
    )
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input type="text" value={img} onChange={(e) => setImg(e.target.value)} required />
                </div>
                <div>
                    <label>Text:</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} required />
                </div>
                <div>
                    <label>Tags (comma separated):</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;