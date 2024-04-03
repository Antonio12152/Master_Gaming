import gameposts from '../database/gameposts.json'
import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts';

const Tag = () => {
    const posts = gameposts.slice().reverse()
    let { tag } = useParams();
    
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