import { useEffect, useState } from 'react';
import TagsList from '../components/TagsList';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Tags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axiosPrivate.get(`/tags`)
            .then(res => {
                const data = res.data
                setTags(data)
                setLoading(false)
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false)});
    }, [axiosPrivate]);
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