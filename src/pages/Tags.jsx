import { useEffect, useState } from 'react';
import TagsList from '../components/TagsList';
import gameposts from '../database/gameposts.json'

const Tags = () => {
    const posts = gameposts
    const [loading, setLoading] = useState(false)
    const tags = posts.reduce((acc, post) => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                if (!acc.includes(tag)) {
                    acc.push(tag);
                }
            });
        }
        return acc;
    }, []);

    useEffect(() => {
        setLoading(true)
        setLoading(false)
    }, []);

    return (
        <TagsList tags={tags} loading={loading}/>
    );
}

export default Tags;