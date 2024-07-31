import { useEffect, useState } from 'react';
import TagsList from '../components/TagsList';

const Tags = () => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetch(`https://mastergaming-production.up.railway.app/tags` || 'http://localhost:5000/tags')
            .then(response => response.json())
            .then(data => setTags(data))
            .catch(error => console.error('Error fetching data:', error));
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
        <TagsList tags={tags.sort()} />
    );
}

export default Tags;