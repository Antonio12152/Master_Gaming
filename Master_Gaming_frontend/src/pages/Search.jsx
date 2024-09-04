import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import GamePosts from "./GamePosts";
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Search = () => {
    const [posts, setPosts] = useState([]);
    let { search } = useParams();
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
        axiosPrivate.get(`/posts`)
            .then(res => {
                const data = res.data
                setPosts(data.slice().reverse().filter(post => post.title.toString().toLowerCase().includes(`${search.toLowerCase()}`) && post.text.toString().toLowerCase().includes(`${search.toLowerCase()}`)))
            })
            .catch(error => { console.error('Error fetching data:', error); });
    }, [axiosPrivate, search]);
    return (
        <GamePosts postsSearch={posts} newpage={search.toLowerCase()}/>
    );
}

export default Search;