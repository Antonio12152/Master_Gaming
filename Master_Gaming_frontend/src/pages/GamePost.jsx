import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const GamePost = () => {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axiosPrivate.get(`/post/${id}`)
            .then(res => {
                const data = res.data
                setPost(data)
                setLoading(false)
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
    }, [axiosPrivate, id]);
    return (
        <div>
            <GamePostSingle post={post} loading={loading} isSinglePost={true}/>
        </div>
    )
}

export default GamePost