import React, {FC, useState} from 'react';
import {useNavigate} from 'react-router';
import styles from '../styles/register.module.css';
import logo from '../../../assets/logo_dpwo_3.png';
import {RegisterFormData} from '../types/RegisterFormData';
import {FormErrors} from '../types/FormErrors';
import {register} from '../api/register';

const ROLES = [
    { value: 'DS_MANAGER', label: 'Dataset manager' }
];

const Register: FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastname: '',
        username: '',
        email: '',
        role: 'DS_MANAGER',
        password: '',
        repeatPassword: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'firstName':
                return value.trim() === '' ? 'First name is required' : '';
            case 'lastname':
                return value.trim() === '' ? 'Lastname is required' : '';
            case 'username':
                return value.trim() === '' ? 'Username is required' : '';
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value) ? 'Invalid email format' : '';
            case 'role':
                return value === '' ? 'Role is required' : '';
            case 'password':
                return value.length < 6 ? 'Password must be at least 6 characters' : '';
            case 'repeatPassword':
                return value !== formData.password ? 'Passwords do not match' : '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key as keyof RegisterFormData]);
            if (error) {
                newErrors[key as keyof FormErrors] = error;
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                submit: 'Error during registration'
            }));
        }
    };

    const getInputClassName = (fieldName: string) => {
        return `${styles.input} ${errors[fieldName as keyof FormErrors] ? styles.inputError : ''}`;
    };

    const getLabelClassName = (fieldName: string) => {
        return `${styles.label} ${errors[fieldName as keyof FormErrors] ? styles.labelError : ''}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentBox}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <div className={styles.formBox}>
                    {errors.submit && <div className={styles.error}>{errors.submit}</div>}
                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        <div className={styles.nameContainer}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="firstName" className={getLabelClassName('firstName')}>
                                    First name <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={getInputClassName('firstName')}
                                    required
                                />
                                {errors.firstName && <div className={styles.fieldError}>{errors.firstName}</div>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="lastname" className={getLabelClassName('lastname')}>
                                    Lastname <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className={getInputClassName('lastname')}
                                    required
                                />
                                {errors.lastname && <div className={styles.fieldError}>{errors.lastname}</div>}
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={getLabelClassName('username')}>
                                Username <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={getInputClassName('username')}
                                required
                            />
                            {errors.username && <div className={styles.fieldError}>{errors.username}</div>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={getLabelClassName('email')}>
                                Email <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={getInputClassName('email')}
                                required
                            />
                            {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="role" className={getLabelClassName('role')}>
                                Role <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`${styles.select} ${getInputClassName('role')}`}
                                required
                            >
                                {ROLES.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <div className={styles.fieldError}>{errors.role}</div>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={getLabelClassName('password')}>
                                Password <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={getInputClassName('password')}
                                required
                            />
                            {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="repeatPassword" className={getLabelClassName('repeatPassword')}>
                                Repeat password <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="password"
                                id="repeatPassword"
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                className={getInputClassName('repeatPassword')}
                                required
                            />
                            {errors.repeatPassword && <div className={styles.fieldError}>{errors.repeatPassword}</div>}
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="button" onClick={() => navigate('/login')} className={styles.returnButton}>
                                Return
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register; 