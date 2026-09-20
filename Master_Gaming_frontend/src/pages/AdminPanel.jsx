import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { BASE_URL } from '../api/axios';

const AdminPanel = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        } catch (err) {
            console.error(err);
            setError('Unable to update user role.');
        }
    };

    if (!isAdmin) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Access denied</h2>
                <p>You need admin access to open this page.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Admin Panel</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Email</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Admin</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Writer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={{ padding: '0.75rem', borderTop: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '0.75rem', borderTop: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '0.75rem', borderTop: '1px solid #ddd' }}>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(user.is_admin)}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, 'is_admin', e.target.checked)
                                        }
                                    />
                                </td>
                                <td style={{ padding: '0.75rem', borderTop: '1px solid #ddd' }}>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(user.is_writer)}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, 'is_writer', e.target.checked)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel;
