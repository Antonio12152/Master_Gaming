import { useEffect, useState } from 'react';
import TagsList from '../components/TagsList';
import gameposts from '../database/gameposts.json'

const Tags = () => {
    const posts = gameposts
    const [loading, setLoading] = useState(false)
    const tags = posts.reduce((arr, post) => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                if (!arr.includes(tag)) {
                    arr.push(tag);
                }
            });
        }
        return arr;
    }, []);

    useEffect(() => {
        setLoading(true)
        setLoading(false)
    }, []);

    return (
        <TagsList tags={tags.sort()} loading={loading} />
    );
}

export default Tags;