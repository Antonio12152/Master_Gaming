import { useEffect, useMemo, useState } from 'react';
import TagsList from '../components/TagsList';
import { BASE_URL } from '../api/axios';
import axios from 'axios';
import { sortTags } from '../utils/tagUtils';

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortMode, setSortMode] = useState('popular');

    useEffect(() => {
        axios.get(`${BASE_URL}/tags`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setTags(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
                setLoading(false);
            });
    }, []);

    const sortedTags = useMemo(() => sortTags(tags, sortMode), [tags, sortMode]);
    const mostPopularTags = useMemo(() => {
        return sortTags([...tags], 'popular').slice(0, 5);
    }, [tags]);

    return (
        <div>
            <div className='tag-featured'>
                <h3>Popular tags</h3>
                <div className='tag-featured-list'>
                    {mostPopularTags.map((tag) => (
                        <a key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}?tag=${encodeURIComponent(tag.name)}&id=1`} className='tag-featured-pill'>
                            #{tag.name}
                        </a>
                    ))}
                </div>
            </div>

            <TagsList
                tags={sortedTags}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                loading={loading}
                sortMode={sortMode}
                onSortChange={setSortMode}
            />
        </div>
    );
};

export default Tags;