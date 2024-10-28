import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const CommentButtonAI = (post) => {
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const handleClick = async () => {
        try {
            await axiosPrivate.post('/commentAI', {
                post_id: post.post.postid,
                title: post.post.title,
                text: post.post.text
            });
            setError(null);
        } catch (error) {
            setError(error.response.data);
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Generate Comment</button>
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default CommentButtonAI;
