import React, {FC} from 'react';
import {Link} from "react-router";


interface HomeProps {
}

const Home: FC<HomeProps> = () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <Link to={"/catalog"}>DatasetCatalog</Link>
        <Link to={"/dataset-edit"}>DatasetEdit</Link>
        <Link to={"/dataset-add"}>DatasetAdd</Link>
        <Link to={"/dataschema-add"}>DataSchemaAdd</Link>
        <Link to={"/dataschema-edit"}>DataSchemaEdit</Link>
    </div>
);

export default Home;
