import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts'

function Users() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    let { username } = useParams();
    useEffect(() => {
        fetch(`http://localhost:5000/users/${username}`)
            .then(response => response.json())
            .then(data => setUser(data[0]))
            .catch(error => console.error('Error fetching data:', error));
    }, [username]);
    useEffect(() => {
        if (user.id) {
            fetch('http://localhost:5000/gameposts')
                .then(response => response.json())
                .then(data => setPosts(data.slice().reverse().filter(post => post.user_id === user.id)))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [user.id]);
    return (
        <div>
            <div>
                <img src={user.user_img} alt="user img" onError={(e) => e.currentTarget.src = '/images/blank_user.png'}  width={120} />
                {user.username}
                {user.about}
                {user.user_created_at}
            </div>
            <h2>{user.username} Posts</h2>
            <GamePosts userPosts={posts} newpage={user.username}/>
        </div>
    );
}

export default Users;