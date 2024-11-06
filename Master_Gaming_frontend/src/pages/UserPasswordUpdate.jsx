import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import '../CSS/usersForm.css';
import { BASE_URL } from '../api/axios';
import axios from 'axios';
import useAuth from "../hooks/useAuth";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const PasswordUpdate = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validNewPassword, setValidNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        setValidNewPassword(PWD_REGEX.test(newPassword));
        setValidMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        setError('');
    }, [oldPassword, newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validNewPassword || !validMatch) {
            setError("Invalid Entry");
            setLoading(false);
            return;
        }

        try {
            await axios.patch(`${BASE_URL}/users/updatePassword`,
                {
                    currentPassword: oldPassword,
                    newPassword
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            navigate(`/posts?user=${auth.user.name}&id=1`);
        } catch (err) {
            if (!err?.response) {
                setError('No Server Response');
            } else {
                setError(`Update Failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="usersForm__main">
            <section className="usersForm__section">
                <p className={error ? "error" : "offscreen"} aria-live="assertive">{error}</p>
                <h1>Update Password</h1>
                <form onSubmit={handleSubmit} className="usersForm__form">
                    <label htmlFor="old_password">Old Password:</label>
                    <input
                        type="password"
                        id="old_password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        value={oldPassword}
                        required
                    />

                    <label htmlFor="new_password">
                        New Password:
                        <FontAwesomeIcon icon={faCheck} className={validNewPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validNewPassword || !newPassword ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="password"
                        id="new_password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        required
                        aria-invalid={validNewPassword ? "false" : "true"}
                        aria-describedby="pwdnote"
                    />
                    <p id="pwdnote" className={!validNewPassword ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number, and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>

                    <label htmlFor="confirm_password">
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && confirmPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !confirmPassword ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="password"
                        id="confirm_password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                    />
                    <p id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the new password.
                    </p>

                    <button disabled={loading || !validNewPassword || !validMatch}>Update Password</button>
                </form>
            </section>
            <div className='post-interaction'>
                <Link to={`/users/update/profile`}>Want to change profile?</Link>
            </div>
        </div>
    );
};

export default PasswordUpdate;
