//import gameposts from '../database/gameposts.json'
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts';
import { useEffect, useState } from 'react';

const Tag = () => {
    //const posts = gameposts.slice().reverse()
    const [posts, setPosts] = useState([]);
    let { tag } = useParams();
    useEffect(() => {
            // posts = gameposts.slice().reverse()
            fetch('http://localhost:5000/gameposts')
                .then(response => response.json())
                .then(data => setPosts(data.slice().reverse()))
                .catch(error => console.error('Error fetching data:', error));
    }, []);
    const postsTag = posts.reduce((arr, post) => {
        if (post.tags && post.tags.includes(tag)) {
            arr.push(post)
        }
        return arr;
    }, []);


    return (
        <GamePosts postsTag={postsTag} pageTag={tag}/>
    );
}

export default Tag;