import React, {FC, useEffect, useState} from 'react';
import {Link} from "react-router";
import HomeLinkBox from './home-link-box';
import styles from '../styles/Home.module.css';
import {AuthService} from '../../auth/services/auth.service';

interface HomeProps {
}

const Home: FC<HomeProps> = () => {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        setUserRole(AuthService.getUserRole());
    }, []);

    const renderHomeLinkBoxes = () => {
        switch (userRole) {
            case 'DATA_USER':
                return (
                    <>
                        <HomeLinkBox name="dataset"/>
                    </>
                );
            default:
                return (
                    <>
                        <HomeLinkBox name="dataschema"/>
                        <HomeLinkBox name="dataset"/>
                        <HomeLinkBox name="owneddataset"/>
                    </>
                );
        }
    };

    return (
        <div className={styles.container}>
            {renderHomeLinkBoxes()}
        </div>
    );
};

export default Home;
