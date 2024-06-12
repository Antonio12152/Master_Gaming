import { useEffect, useState } from "react";
// import gameposts from '../database/gameposts.json'
// import usersData from '../database/usersData.json'
import GamePostsList from "../components/GamePostsList";
import { useParams } from "react-router-dom";

const GamePosts = ({ postsTag, pageTag }) => {
    //let posts
    let page = ""
    const [posts, setPosts] = useState([]);
    if (postsTag !== undefined && postsTag) {
        // posts = postsTag
        page = `tags/${pageTag}`
    } else {
        // posts = gameposts.slice().reverse()
        page = "posts"
    }

    useEffect(() => {
        if (postsTag !== undefined && postsTag) {
            // posts = postsTag
            setPosts(postsTag)
        } else {
            // posts = gameposts.slice().reverse()
            fetch('http://localhost:5000/gameposts')
                .then(response => response.json())
                .then(data => setPosts(data.slice().reverse()))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [postsTag]);

    // const users = new Map(usersData.map(user => [user.id, user.username]));

    // const postsData = posts.map(post => ({
    //     ...post,
    //     username: users.get(post.userid) || 'Deleted'
    // }));

    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    let { id } = useParams();
    useEffect(() => {
        if (id !== undefined) {
            setCurrentPage(parseInt(id));
        }
    }, [id]);

    const indexOfLastPost = Math.min(currentPage * postsPerPage, posts.length);
    const indexOfFirstPost = currentPage * postsPerPage - postsPerPage

    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
    //const paginate = (pageNumber) => setCurrentPage(pageNumber) // if paginate broke uncomment this and add in GamePostsList

    return (
        <div>
            <GamePostsList page={page} TotalPosts={posts.length} currentPosts={currentPosts} postsPerPage={postsPerPage} currentPage={currentPage} />
        </div>
    )
}

export default GamePosts