import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './Searchbar'; // Предполагается, что у вас есть компонент SearchBar

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header" id="header">
            <div className="header__left">
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                <ul className={`header__ul ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to='/'>Master Gaming</Link>
                    </li>
                    <li>
                        <Link to='/posts/1'>Posts</Link>
                    </li>
                    <li>
                        <Link to='/tags'>Tags</Link>
                    </li>
                    <li>
                        <Link to='/videos/1'>Videos</Link>
                    </li>
                </ul>
            </div>
            <SearchBar className="header__center"/>
            <ul className='header__user'>
                <li>
                    <img src="/images/blank_user.png" alt="User" />
                </li>
            </ul>
        </header>
    );
};

export default Header;