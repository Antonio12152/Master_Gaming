import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { BASE_URL } from '../api/axios';
import '../CSS/AdminPanel.css';

const AdminPanel = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [status, setStatus] = useState('');

    const isAdmin = useMemo(() => Boolean(auth?.user?.roles?.admin), [auth]);

    useEffect(() => {
        if (!isAdmin) return;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                    withCredentials: true
                });
                setUsers(response.data || []);
            } catch (err) {
                console.error(err);
                setError('Unable to load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [auth, isAdmin]);

    const handleRoleChange = async (userId, field, value) => {
        setError('');
        setStatus('Saving role change...');
        setUpdatingUserId(userId);
        try {
            const response = await axios.patch(
                `${BASE_URL}/admin/users/${userId}/roles`,
                { [field]: value },
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            setUsers((current) =>
                current.map((user) =>
                    user.id === userId ? { ...user, ...response.data.user } : user
                )
            );
            setStatus('Role change saved.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.err || 'Unable to update user role.');
            setStatus('');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchValue = filter.trim().toLowerCase();
        return !searchValue || [user.name, user.email].some((value) =>
            value?.toLowerCase().includes(searchValue)
        );
    });

    if (!isAdmin) {
        return (
            <div className="admin-panel admin-panel--denied">
                <h2>Access denied</h2>
                <p>You need admin access to open this page.</p>
            </div>
        );
    }

    return (
        <main className="admin-panel">
            <div className="admin-panel__header">
                <div>
                    <p className="admin-panel__eyebrow">Management</p>
                    <h2>Admin Panel</h2>
                    <p className="admin-panel__summary">Manage access for {users.length} active users.</p>
                </div>
                <label className="admin-panel__filter">
                    <span>Filter users</span>
                    <input
                        type="search"
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                        placeholder="Search name or email"
                    />
                </label>
            </div>

            {error && <p className="admin-panel__message admin-panel__message--error">{error}</p>}
            {status && <p className="admin-panel__message admin-panel__message--success">{status}</p>}

            {loading ? (
                <p className="admin-panel__loading">Loading users...</p>
            ) : (
                <div className="admin-panel__table-wrap">
                <table className="admin-panel__table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Writer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(user.is_admin)}
                                        disabled={user.id === auth.user.id || updatingUserId === user.id}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, 'is_admin', e.target.checked)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(user.is_writer)}
                                        disabled={user.id === auth.user.id || updatingUserId === user.id}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, 'is_writer', e.target.checked)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr><td className="admin-panel__empty" colSpan="4">No users match this filter.</td></tr>
                        )}
                    </tbody>
                </table>
                </div>
            )}
        </main>
    );
};

export default AdminPanel;
