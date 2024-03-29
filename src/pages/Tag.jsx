import gamepost from '../database/gamepost.json'
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts';

const Tag = () => {
    const posts = gamepost.slice().reverse()
    let { tag } = useParams();
    
    const postsTag = posts.reduce((acc, post) => {
        if (post.tags && post.tags.includes(tag)) {
            acc.push(post)
        }
        return acc;
    }, []);


    return (
        <GamePosts postsTag={postsTag} pageTag={`tags/${tag}`}/>
    );
}

export default Tag;