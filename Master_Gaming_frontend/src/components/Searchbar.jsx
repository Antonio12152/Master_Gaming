import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Search.css';

const SearchBar = () => {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedText = searchText.trim();
        if (trimmedText) {
            navigate(`/search/${trimmedText}/1`);
        }
    };

    return (
        <form name="myForm" onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                name="fname"
                id="searchText_id"
                value={searchText}
                onChange={handleChange}
                className="search-input"
                placeholder="Search..."
            />
            <button type="submit" className="search-button">
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </form>
    );
};

export default SearchBar;
