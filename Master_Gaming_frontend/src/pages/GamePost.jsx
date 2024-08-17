import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

const GamePost = () => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();

    useEffect(() => {
        axios.get(`https://mastergaming-production.up.railway.app/gamePosts` || 'http://localhost:5000/gamePosts')
            .then(res => {
                const data = res.data
                const post = data.find(post => Number(post.postid) === Number(id));
                setPost(post)
                setLoading(false)
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
    }, [id]);
    return (
        <div>
            <GamePostSingle post={post} loading={loading} isSinglePost={true}/>
        </div>
    )
}

export default GamePost