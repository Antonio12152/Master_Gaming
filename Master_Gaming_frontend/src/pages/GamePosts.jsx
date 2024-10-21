import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QueryParamsForm from "../components/QueryParamsForm";
import GamePostsList from "../components/GamePostsList";
import { axiosPrivate } from "../api/axios";
import UserI from "../components/UserI";

const Test = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState('');
    const [id, setId] = useState('');
    const [user, setUser] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [postsPerPage] = useState(5);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearch(queryParams.get('search') || '');
        setTags(queryParams.get('tags') || '');
        setId(queryParams.get('id') || '1');
        setUser(queryParams.get('user') || '');
    }, [location.search]);

    const updateUrl = (searchValue, tagsValue, idValue) => {
        const params = new URLSearchParams();
        if (searchValue) params.set('search', searchValue);
        if (tagsValue) params.set('tags', tagsValue);
        if (idValue) params.set('id', idValue);
        if (user) params.set('user', user);

        navigate(`/posts?${params.toString()}`);
    };

    const handleSubmit = (searchValue, tagsValue, idValue) => {
        setSearch(searchValue);
        setTags(tagsValue);
        setId(idValue);
        updateUrl(searchValue, tagsValue, idValue);
    };

    useEffect(() => {
        axiosPrivate.get(`/posts`)
            .then(res => {
                const data = res.data;
                const tagArray = tags
                    .split(',')
                    .map(tag => tag.trim().toLowerCase())
                    .filter(tag => tag !== '');

                const filteredPosts = data.filter(post => {
                    const matchesSearch = search
                        ? post.title.toLowerCase().includes(search.toLowerCase()) || post.text.toLowerCase().includes(search.toLowerCase())
                        : true;

                    const matchesTags = tagArray.length > 0
                        ? tagArray.every(tag => post.tags && post.tags.some(postTag => postTag.toLowerCase() === tag))
                        : true;

                    const matchesUser = user ? post.username === user : true;

                    return matchesSearch && matchesTags && matchesUser;
                });

                setPosts(filteredPosts.reverse());
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [search, tags, user]);

    useEffect(() => {
        axiosPrivate.get(`/users/${user}`)
            .then(res => {
                const data = res.data
                setUserInfo(data[0])
            })
            .catch(error => { console.error('Error fetching data:', error); });
    }, [user]);

    const indexOfLastPost = Math.min(id * postsPerPage, posts.length);
    const indexOfFirstPost = id * postsPerPage - postsPerPage;

    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div>
            {user !== "" ? (
                <UserI user={userInfo} />
            ) : <></>}
            
            <QueryParamsForm
                search={search}
                tags={tags}
                id={id}
                onSubmit={handleSubmit}
            />

            <GamePostsList
                page={"posts"}
                search={search}
                tags={tags}
                user={user}
                TotalPosts={posts.length}
                currentPosts={currentPosts}
                postsPerPage={postsPerPage}
                currentPage={parseInt(id)}
                loading={loading}
            />
        </div>
    );
};

export default Test;
