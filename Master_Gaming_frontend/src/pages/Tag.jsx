import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts';
import { useEffect, useMemo, useState } from 'react';

const Tag = () => {
    const [posts, setPosts] = useState([]);
    let { tag } = useParams();
    useEffect(() => {
        fetch(`https://mastergaming-production.up.railway.app/gameposts` || 'http://localhost:5000/gameposts')
            .then(response => response.json())
            .then(data => setPosts(data.slice().reverse()))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    const postsTag = useMemo(() => {
        return posts.filter(post => post.tags && post.tags.includes(tag));
    }, [posts, tag]);


    return (
        <GamePosts postsTag={postsTag} newpage={tag} />
    );
}

export default Tag;