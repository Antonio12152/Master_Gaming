import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts'
import UserI from '../components/UserI';
const User = () =>{
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    let { username } = useParams();
    useEffect(() => {
        fetch(`https://mastergaming-production.up.railway.app/users/${username}` || `http://localhost:5000/users/${username}`)
            .then(response => response.json())
            .then(data => setUser(data[0]))
            .catch(error => console.error('Error fetching data:', error));
    }, [username]);
    useEffect(() => {
        if (user.id) {
            fetch(`https://mastergaming-production.up.railway.app/gameposts` || 'http://localhost:5000/gameposts')
                .then(response => response.json())
                .then(data => setPosts(data.slice().reverse().filter(post => post.user_id === user.id)))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [user.id]);
    return (
        <div>
            <UserI user={user}/>
            <GamePosts userPosts={posts} newpage={user.username}/>
        </div>
    );
}

export default User;