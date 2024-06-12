import { useEffect, useState } from 'react';
import TagsList from '../components/TagsList';
//import gameposts from '../database/gameposts.json'

const Tags = () => {
    // const posts = gameposts
    // const tags = posts.reduce((arr, post) => {
    //     if (post.tags && Array.isArray(post.tags)) {
    //         post.tags.forEach(tag => {
    //             if (!arr.includes(tag)) {
    //                 arr.push(tag);
    //             }
    //         });
    //     }
    //     return arr;
    // }, []);
    const [tags, setTags] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:5000/tags')
            .then(response => response.json())
            .then(data => setTags(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <TagsList tags={tags.sort()} />
    );
}

export default Tags;