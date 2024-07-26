import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import GamePosts from "./GamePosts";

const Search = () => {
    const [posts, setPosts] = useState([]);
    let { search } = useParams();
    useEffect(() => {
        fetch('http://localhost:5000/gameposts')
            .then(response => response.json())
            .then(data => setPosts(data.slice().reverse().filter(post => post.title.toString().toLowerCase().includes(`${search}`) && post.text.toString().toLowerCase().includes(`${search}`))))
            .catch(error => console.error('Error fetching data:', error));
    }, [search]);
    return (
        <GamePosts postsSearch={posts} newpage={search} />
    );
}

export default Search;