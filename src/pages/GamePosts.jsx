import { useEffect, useState } from "react";
//import axios from "axios";
import gameposts from '../database/gameposts.json'
import usersData from '../database/usersData.json'
import GamePostsList from "../components/GamePostsList";
import { useParams } from "react-router-dom";

const GamePosts = ({ postsTag, pageTag }) => {
    let posts
    let page = ""
    if (postsTag !== undefined && postsTag) {
        posts = postsTag
        page = `tags/${pageTag}`
    } else {
        posts = gameposts.slice().reverse()
        page = "posts"
    }

    const users = new Map(usersData.map(user => [user.id, user.username]));

    const postsData = posts.map(post => ({
        ...post,
        username: users.get(post.userid) || 'Deleted'
    }));

    //const [posts, setPosts] = useState([])
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
    //         const res = await axios.get("http://localhost:3001/") // here your database url or server js file
    //         setPosts(res)
    //         setLoading(false)
    //     }
    //     fetchPosts()
    // }, []);
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage

    const currentPost = postsData.slice(indexOfFirstPost, indexOfLastPost)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div>
            <GamePostsList page={page} posts={postsData} currentPost={currentPost} loading={loading} postsPerPage={postsPerPage} paginate={paginate} currentPage={currentPage} />
        </div>
    )
}

export default GamePosts