import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts'
import UserI from '../components/UserI';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const User = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    let { username } = useParams();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axiosPrivate.get(`/users/${username}`)
            .then(res => {
                const data = res.data
                setUser(data[0])
            })
            .catch(error => { console.error('Error fetching data:', error);});
    }, [axiosPrivate, username]);
    useEffect(() => {
        if (user.id) {
            axiosPrivate.get(`/gamePosts`)
                .then(res => {
                    const data = res.data
                    setPosts(data.slice().reverse().filter(post => post.user_id === user.id))
                })
                .catch(error => { console.error('Error fetching data:', error);});
        }
    }, [axiosPrivate,user.id]);
    return (
        <div>
            <UserI user={user} />
            <GamePosts userPosts={posts} newpage={user.username}/>
        </div>
    );
}

export default User;