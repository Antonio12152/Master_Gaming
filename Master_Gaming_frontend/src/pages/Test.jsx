import React, { useState, useEffect } from 'react';
// use this excemple to join backend and frontend
function Test() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/gameposts')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Game Posts</h1>
            <ul>
                {data.map((post, index) => (
                    <li key={index}>
                        <h2>{post.title}</h2>
                        <p>Username: {post.username}</p>
                        <p>Tags: {post.tags.join(', ')}</p>
                        <p>Image: <img src={post.imgurl} width="300px" alt={post.title} /></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Test;