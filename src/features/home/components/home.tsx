import React, {FC} from 'react';
import {Link} from "react-router";
import HomeLinkBox from './home-link-box';
import styles from '../styles/Home.module.css';

interface HomeProps {
}

const Home: FC<HomeProps> = () => (
    <div className={styles.container}>
        <HomeLinkBox name="dataschema"/>
        <HomeLinkBox name="dataset"/>
        <HomeLinkBox name="owneddataset"/>
    </div>
);

export default Home;
