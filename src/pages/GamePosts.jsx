import { useEffect, useState } from "react";
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

    let [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    let { id } = useParams();
    useEffect(() => {
        if (id !== undefined) {
            setCurrentPage(parseInt(id));
        }
    }, [id]);

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage

    const currentPost = postsData.slice(indexOfFirstPost, indexOfLastPost)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div>
            <GamePostsList page={page} posts={postsData} currentPost={currentPost} postsPerPage={postsPerPage} paginate={paginate} currentPage={currentPage} />
        </div>
    )
}

export default GamePosts