import React, {FC} from 'react';
import {Link} from "react-router";


interface HomeProps {
}

const Home: FC<HomeProps> = () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <Link to={"/catalog"}>Catalog</Link>
        <Link to={"/dataset-edit"}>DatasetEdit</Link>
    </div>
);

export default Home;
