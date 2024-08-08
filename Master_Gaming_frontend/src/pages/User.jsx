import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts'
import UserI from '../components/UserI';
import axios from 'axios';

const User = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    let { username } = useParams();

    useEffect(() => {
        axios.get(`https://mastergaming-production.up.railway.app/users/${username}` || `http://localhost:5000/users/${username}`)
            .then(res => {
                const data = res.data
                setUser(data[0])
            })
            .catch(error => { console.error('Error fetching data:', error);});
    }, [username]);
    useEffect(() => {
        if (user.id) {
            axios.get(`https://mastergaming-production.up.railway.app/gamePosts` || 'http://localhost:5000/gamePosts')
                .then(res => {
                    const data = res.data
                    setPosts(data.slice().reverse().filter(post => post.user_id === user.id))
                })
                .catch(error => { console.error('Error fetching data:', error);});
        }
    }, [user.id]);
    return (
        <div>
            <UserI user={user} />
            <GamePosts userPosts={posts} newpage={user.username}/>
        </div>
    );
}

export default User;