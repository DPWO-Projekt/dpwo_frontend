import React, {FC, useState} from 'react';
import {useNavigate} from 'react-router';
import styles from '../styles/register.module.css';
import logo from '../../../assets/logo_dpwo_3.png';
import {LoginFormData} from '../types/LoginFormData';
import {login} from '../api/login';

const Login: FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        usernameOrEmail: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError('Failed to login');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentBox}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <div className={styles.formBox}>
                    {error && <div className={styles.error}>{error}</div>}
                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        <div className={styles.inputGroup}>
                            <label htmlFor="usernameOrEmail">
                                Username or Email <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="usernameOrEmail"
                                name="usernameOrEmail"
                                value={formData.usernameOrEmail}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">
                                Password <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.blueTextButton}>
                                Login
                            </button>
                            <button type="button" onClick={() => navigate('/register')} className={styles.redTextButton}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login; 