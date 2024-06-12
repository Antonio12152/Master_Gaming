//import gameposts from '../database/gameposts.json'
//import usersData from '../database/usersData.json'
import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

const GamePost = () => {
    const [post, setPost] = useState([]);
    let { id } = useParams();
    useEffect(() => {
        fetch('http://localhost:5000/gameposts')
            .then(response => response.json())
            .then(data => {
                const post = data.find(post => post.id === Number(id));
                setPost(post)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [id]);
    // const users = new Map(usersData.map(user => [user.id, user.username]));
    // const postsData = posts.map(post => ({
    //     ...post,
    //     username: users.get(post.userid) || 'Deleted'
    // }));

    return (
        <div>
            <GamePostSingle post={post} />
        </div>
    )
}

export default GamePost