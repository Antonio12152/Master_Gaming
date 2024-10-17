import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './Searchbar';
import useAuth from '../hooks/useAuth';
import { BASE_URL } from '../api/axios';
import axios from 'axios';

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const { auth, setAuth } = useAuth()

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
        setUserMenuOpen(false);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!isUserMenuOpen);
        setMenuOpen(false);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await axios.post(`${BASE_URL}/logout`,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        setAuth({})
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
            {!auth || auth.user === undefined ? (
                <div className='header__user'>
                    <img src="/images/blank_user.png" alt="User" onClick={toggleUserMenu} />
                    <ul className={`header__user__ul ${isUserMenuOpen ? 'open' : ''}`}>
                        <li>
                            <Link to='/login' onClick={toggleUserMenu}>Login</Link>
                        </li>
                        <li>
                            <Link to='/register' onClick={toggleUserMenu}>Register</Link>
                        </li>
                    </ul>
                </div>
            ) :
                (
                    <div className='header__user'>
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
                                <a href='/' onClick={handleLogout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                )}
        </header>
    );
};

export default Header;