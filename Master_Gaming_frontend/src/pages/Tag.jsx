import { useParams } from 'react-router-dom';
import GamePosts from './GamePosts';
import { useEffect, useMemo, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Tag = () => {
    const [posts, setPosts] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    let { tag } = useParams();
    useEffect(() => {
        axiosPrivate.get(`/gamePosts`)
            .then(res => {
                const data = res.data
                setPosts(data.slice().reverse())
            })
            .catch(error => { console.error('Error fetching data:', error); });
    }, [axiosPrivate]);
    const postsTag = useMemo(() => {
        return posts.filter(post => post.tags && post.tags.includes(tag));
    }, [posts, tag]);


    return (
        <GamePosts postsTag={postsTag} newpage={tag} />
    );
}

export default Tag;