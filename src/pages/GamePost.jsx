import gameposts from '../database/gameposts.json'
import usersData from '../database/usersData.json'
import GamePostSingle from "../components/GamePostSingle";
import { useParams } from "react-router-dom";

const GamePost = () => {
    const posts = gameposts
    const users = new Map(usersData.map(user => [user.id, user.username]));
    const postsData = posts.map(post => ({
        ...post,
        username: users.get(post.userid) || 'Deleted'
    }));
    
    let { id } = useParams();

    const post = postsData.find(post => post.id === Number(id));

    return (
        <div>
            <GamePostSingle post={post} />
        </div>
    )
}

export default GamePost