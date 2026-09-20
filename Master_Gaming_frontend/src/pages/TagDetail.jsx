import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import GamePostsList from '../components/GamePostsList';
import { BASE_URL } from '../api/axios';

const TagDetail = () => {
    const location = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const tagName = queryParams.get('tag') || '';
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(queryParams.get('id') || '1');

    useEffect(() => {
        setPage(queryParams.get('id') || '1');
    }, [queryParams]);

    useEffect(() => {
        if (!tagName) {
            setPosts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        axios.get(`${BASE_URL}/posts`)
            .then((res) => {
                const filtered = (res.data || []).filter((post) => {
                    const tags = Array.isArray(post.tags) ? post.tags : [];
                    return tags.some((item) => item.toLowerCase() === tagName.toLowerCase());
                });

                setPosts(filtered.reverse());
            })
            .catch((error) => {
                console.error('Error fetching tag posts:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tagName]);

    const postsPerPage = 5;
    const indexOfLastPost = Math.min(Number(page) * postsPerPage, posts.length);
    const indexOfFirstPost = Number(page) * postsPerPage - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    if (!tagName) {
        return (
            <div className='div-main'>
                <h2>No tag selected</h2>
                <Link to='/tags'>Go back to tags</Link>
            </div>
        );
    }

    return (
        <div>
            <div className='tag-featured'>
                <h2 style={{ marginBottom: '0.5rem' }}>#{tagName}</h2>
                <p style={{ margin: 0, color: '#dfe7f5' }}>
                    {posts.length} post{posts.length === 1 ? '' : 's'} found for this tag.
                </p>
            </div>

            {loading ? (
                <div className='div-main'>Loading posts...</div>
            ) : (
                <GamePostsList
                    page='posts'
                    search=''
                    tags={tagName}
                    user=''
                    TotalPosts={posts.length}
                    currentPosts={currentPosts}
                    postsPerPage={postsPerPage}
                    currentPage={Number(page) || 1}
                />
            )}
        </div>
    );
};

export default TagDetail;
