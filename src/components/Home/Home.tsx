import React, {FC} from 'react';
import {Link} from "react-router";


interface HomeProps {
}

const Home: FC<HomeProps> = () => (
    <div>
        <Link to={"/catalog"}>Catalog</Link>
    </div>
);

export default Home;
