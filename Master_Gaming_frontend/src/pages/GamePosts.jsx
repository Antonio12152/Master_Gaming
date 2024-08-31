import { useEffect, useMemo, useState } from "react";
import GamePostsList from "../components/GamePostsList";
import { useParams } from "react-router-dom";
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const GamePosts = ({ postsTag, postsSearch, userPosts, newpage }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    let page = useMemo(() => {
        if (postsTag !== undefined && postsTag) {
            setLoading(false)
            return `tags/${newpage}`;
        } else if (postsSearch !== undefined && postsSearch) {
            setLoading(false)
            return `search/${newpage}`;
        } else if (userPosts !== undefined && userPosts) {
            setLoading(false)
            return `users/${newpage}`;
        } else {
            return "posts";
        }
    }, [postsTag, postsSearch, userPosts, newpage]);

    useEffect(() => {
        if (postsTag !== undefined && postsTag) {
            setPosts(postsTag)
        } else if (postsSearch !== undefined && postsSearch) {
            setPosts(postsSearch)
        } else if (userPosts !== undefined && userPosts) {
            setPosts(userPosts)
        } else {
            axiosPrivate.get(`/gamePosts`)
                .then(res => {
                    const data = res.data
                    setPosts(data.slice().reverse())
                    setLoading(false)
                })
                .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
        }
    }, [axiosPrivate, postsTag, postsSearch, userPosts]);

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

    return (
        <div>
            <GamePostsList page={page} TotalPosts={posts.length} currentPosts={currentPosts} postsPerPage={postsPerPage} currentPage={currentPage} loading={loading} />
        </div>
    )
}

export default GamePosts