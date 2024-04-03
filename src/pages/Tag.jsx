import gameposts from '../database/gameposts.json'
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts';

const Tag = () => {
    const posts = gameposts.slice().reverse()
    let { tag } = useParams();
    
    const postsTag = posts.reduce((acc, post) => {
        if (post.tags && post.tags.includes(tag)) {
            acc.push(post)
        }
        return acc;
    }, []);


    return (
        <GamePosts postsTag={postsTag} pageTag={tag}/>
    );
}

export default Tag;