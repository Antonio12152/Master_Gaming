import { useState, useEffect } from "react";
import '../CSS/QueryForm.css'
const QueryParamsForm = ({ search, tags, id, onSubmit }) => {
    const [localSearch, setLocalSearch] = useState(search);
    const [localTags, setLocalTags] = useState(tags);
    const [localId, setLocalId] = useState(id);

    useEffect(() => {
        setLocalSearch(search.trim());
    }, [search]);

    useEffect(() => {
        setLocalTags(tags.trim());
    }, [tags]);

    useEffect(() => {
        setLocalId(id.trim() || '1');
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();

        onSubmit(localSearch, localTags, localId);
    }

    function handleReset(event) {
        event.preventDefault();
        setLocalSearch('');
        setLocalTags('');
        setLocalId('1');

        onSubmit('', '', '1');
    }

    return (
        <form className="QueryForm" onSubmit={handleSubmit} onReset={handleReset}>
            <label htmlFor="search">Search</label><br />
            <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            /><br />

            <label htmlFor="tags">Tags</label><br />
            <input
                type="text"
                value={localTags}
                onChange={(e) => setLocalTags(e.target.value)}
            /><br />

            <label htmlFor="id">ID</label><br />
            <input
                type="text"
                value={localId}
                id="id"
                onChange={(e) => setLocalId(e.target.value)}
            /><br />
            <div>
                <input type="submit" value="Submit" />
                <input type="reset" value="Reset" />
            </div>
        </form>
    );
};

export default QueryParamsForm;
