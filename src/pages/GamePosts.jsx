import { useEffect, useState } from "react";
//import axios from "axios";
import gamepost from '../database/gamepost.json'
import GamePostsList from "../components/GamePostsList";
import { useParams } from "react-router-dom";

const GamePosts = ({ postsTag, pageTag }) => {
    let posts
    let page
    if (postsTag !== undefined && postsTag) {
        posts = postsTag
        page = pageTag
    } else {
        posts = gamepost.slice().reverse()
        page = "posts"
    }

    // const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    let [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    let { id } = useParams();
    useEffect(() => {
        setLoading(true);
        if (id !== undefined) {
            setCurrentPage(parseInt(id));
        }
        setLoading(false);
    }, [id]);
    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         setLoading(true)
    //         const res = await axios.get(gamepost) // here your database url or server js file
    //         setPosts(res)
    //         setLoading(false)
    //     }
    //     fetchPosts()
    // }, []);
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage

    const currentPost = posts.slice(indexOfFirstPost, indexOfLastPost)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div>
            <GamePostsList page={page} posts={posts} currentPost={currentPost} loading={loading} postsPerPage={postsPerPage} paginate={paginate} currentPage={currentPage} />
        </div>
    )
}

export default GamePosts