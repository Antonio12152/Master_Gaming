import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

const GamePost = () => {
    const [post, setPost] = useState([]);
    let { id } = useParams();
    
    useEffect(() => {
        fetch(`https://mastergaming-production.up.railway.app/gamePosts` || 'http://localhost:5000/gamePosts')
            .then(response => response.json())
            .then(data => {
                const post = data.find(post => Number(post.postid) === Number(id));
                setPost(post)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [id]);

    return (
        <div>
            <GamePostSingle post={post} />
        </div>
    )
}

export default GamePost