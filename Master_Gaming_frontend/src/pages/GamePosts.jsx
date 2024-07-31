import { useEffect, useMemo, useState } from "react";
import GamePostsList from "../components/GamePostsList";
import { useParams } from "react-router-dom";

const GamePosts = ({ postsTag, postsSearch, userPosts, newpage }) => {
    const [posts, setPosts] = useState([]);
    let page = useMemo(() => {
        if (postsTag !== undefined && postsTag) {
            return `tags/${newpage}`;
        } else if (postsSearch !== undefined && postsSearch) {
            return `search/${newpage}`;
        }else if (userPosts !== undefined && userPosts) {
            return `users/${newpage}`;
        } else {
            return "posts";
        }
    }, [postsTag, postsSearch,userPosts, newpage]);

    useEffect(() => {
        if (postsTag !== undefined && postsTag) {
            setPosts(postsTag)
        } else if (postsSearch !== undefined && postsSearch) {
            setPosts(postsSearch)
        }else if (userPosts !== undefined && userPosts) {
            setPosts(userPosts)
        } else {
            fetch(`https://mastergaming-production.up.railway.app/gameposts` || 'http://localhost:5000/gameposts')
                .then(response => response.json())
                .then(data => setPosts(data.slice().reverse()))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [postsTag, postsSearch, userPosts]);

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