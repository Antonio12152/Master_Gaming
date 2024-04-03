import { useEffect, useState } from "react";
// import axios from "axios";
import gameposts from '../database/gameposts.json'
import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";

const GamePost = () => {
    const posts = gameposts
    let { id } = useParams();
    // const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const post = posts.find(post => post.id === Number(id));

    useEffect(() => {
        setLoading(true)
        setLoading(false)
    }, []);
    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         setLoading(true)
    //         const res = await axios.get(gamepost)
    //         setPosts(res.data)
    //         setLoading(false)
    //     }
    //     fetchPosts()
    // }, []);

    return (
        <div>
            <GamePostSingle post={post} loading={loading} />
        </div>
    )
}

export default GamePost