import TagsList from '../components/TagsList';
import gameposts from '../database/gameposts.json'

const Tags = () => {
    const posts = gameposts
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


    return (
        <TagsList tags={tags.sort()} />
    );
}

export default Tags;