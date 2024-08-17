import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import GamePosts from "./GamePosts";
import axios from 'axios';

const Search = () => {
    const [posts, setPosts] = useState([]);
    let { search } = useParams();
    
    useEffect(() => {
        axios.get(`https://mastergaming-production.up.railway.app/gamePosts` || 'http://localhost:5000/gamePosts')
            .then(res => {
                const data = res.data
                setPosts(data.slice().reverse().filter(post => post.title.toString().toLowerCase().includes(`${search.toLowerCase()}`) && post.text.toString().toLowerCase().includes(`${search.toLowerCase()}`)))
            })
            .catch(error => { console.error('Error fetching data:', error); });
    }, [search]);
    return (
        <GamePosts postsSearch={posts} newpage={search.toLowerCase()}/>
    );
}

export default Search;