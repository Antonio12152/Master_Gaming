import { useEffect, useState } from 'react';
import TagsList from '../components/TagsList';
import { BASE_URL } from '../api/axios';
import axios from 'axios';

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BASE_URL}/tags`)
            .then(res => {
                const data = res.data
                setTags(data)
                setLoading(false)
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false)});
    }, []);
    tags.sort((a, b) => {
        const taga = a.name.toUpperCase();
        const tagb = b.name.toUpperCase();
        if (taga < tagb) {
            return -1;
        }
        if (taga > tagb) {
            return 1;
        }

        return 0;
    });
    return (
        <TagsList tags={tags.sort()} loading={loading}/>
    );
}

export default Tags;