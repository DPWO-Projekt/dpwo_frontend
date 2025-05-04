import React, {FC} from 'react';
import {Link} from "react-router";
import HomeLinkBox from './HomeLinkBox';
import styles from './Home.module.css';

interface HomeProps {
}

const Home: FC<HomeProps> = () => (
    <div className={styles.container}>
        <HomeLinkBox name="dataschema"/>
        <HomeLinkBox name="dataset"/>
    </div>
);

export default Home;
