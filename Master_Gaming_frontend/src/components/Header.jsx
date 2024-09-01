import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './Searchbar'; // Предполагается, что у вас есть компонент SearchBar
import useAuth from '../hooks/useAuth';

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const { auth } = useAuth()

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
        setUserMenuOpen(false);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!isUserMenuOpen);
        setMenuOpen(false);
    };

    let userHeader;
    if (!auth || auth.user === undefined) {
        userHeader = <div className='header__user'>
            <img src="/images/blank_user.png" alt="User" />
            <ul className={`header__user__ul ${isUserMenuOpen ? 'open' : ''}`}>
                <li>
                    <Link to='/login' onClick={toggleUserMenu}>Login</Link>
                </li>
                <li>
                    <Link to='/register' onClick={toggleUserMenu}>Register</Link>
                </li>
            </ul>
        </div>
    } else {
        userHeader = <div className='header__user'>
            <img src={auth.user.img} alt="User" onClick={toggleUserMenu} onError={(e) => e.currentTarget.src = '/images/blank_user.png'} />
            <ul className={`header__user__ul ${isUserMenuOpen ? 'open' : ''}`}>
                <li>
                    <Link to={`/users/${auth.user.name}`} onClick={toggleUserMenu}>Account</Link>
                </li>
                {auth.user.roles.writer && (
                    <li>
                        <Link to='/insertpost' onClick={toggleUserMenu}>Write Post</Link>
                    </li>
                )}
                <li>
                    <Link to='/logout' onClick={toggleUserMenu}>Logout</Link>
                </li>
            </ul>
        </div>
    }
    return (
        <header className="header" id="header">
            <div className="header__left">
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                <ul className={`header__ul ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to='/' onClick={toggleMenu}>Master Gaming</Link>
                    </li>
                    <li>
                        <Link to='/posts/1' onClick={toggleMenu}>Posts</Link>
                    </li>
                    <li>
                        <Link to='/tags' onClick={toggleMenu}>Tags</Link>
                    </li>
                    <li>
                        <Link to='/videos/1' onClick={toggleMenu}>Videos</Link>
                    </li>
                </ul>
            </div>
            <SearchBar className="header__center" />
            {userHeader}
        </header>
    );
};

export default Header;