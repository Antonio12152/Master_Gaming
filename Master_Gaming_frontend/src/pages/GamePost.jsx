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
        axiosPrivate.get(`/gamePosts`)
            .then(res => {
                const data = res.data
                const post = data.find(post => Number(post.postid) === Number(id));
                setPost(post)
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