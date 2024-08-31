import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/gameposts');
                setPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleSelectPost = async (id) => {
        try {
            const response = await axiosPrivate.get(`/gameposts`);
            const post = response.data.find(post => Number(post.postid) === Number(id));
            setSelectedPost(post);
        } catch (error) {
            console.error('Failed to fetch post details:', error);
        }
    };

    return (
        <div>
            <h1>Posts</h1>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post.postid} onClick={() => handleSelectPost(Number(post.postid))}>
                            {post.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts available.</p>
            )}

            {selectedPost && (
                <div>
                    <h2>{selectedPost.title}</h2>
                    <p>{selectedPost.content}</p>
                    <p>Author: {selectedPost.author}</p>
                    {selectedPost.isEditable && (
                        <div>
                            <button>Edit Post</button>
                            <button>Delete Post</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Posts;
