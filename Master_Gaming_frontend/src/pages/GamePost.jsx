import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/axios';

const GamePost = () => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/post/${id}`)
            .then(res => {
                const data = res.data
                setPost(data)
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