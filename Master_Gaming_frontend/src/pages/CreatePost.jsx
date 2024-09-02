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

            if (response.status !== 201) {
                throw new Error(response.data || 'Error inserting post');
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
        <div className='cpost__main'>
            <section className='cpost__section'>
                <p className={error ? "error" : "offscreen"} aria-live="assertive">{error}</p>
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit} className='cpost__form'>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label htmlFor="img">Image URL:</label>
                    <input
                        type="text"
                        id="img"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        required
                    />
                    <label htmlFor="text">Text:</label>
                    <input
                        type="text"
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <label htmlFor="tags">Tags (comma separated):</label>
                    <input
                        type="text"
                        id='tags'
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <button disabled={loading || !title || !img || !text}>Create Post</button>
                </form>
            </section>
        </div>
    );
};

export default CreatePost;