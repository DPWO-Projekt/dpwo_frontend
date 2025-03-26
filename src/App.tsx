import React from 'react';
import './App.css';
import {Route, Routes} from "react-router";
import Home from "./components/Home/Home";
import CatalogView from "./components/Catalog/CatalogView";
import DatasetEdit from './components/DatasetEdit/DatasetEdit';
import DatasetAdd from './components/DatasetAdd/DatasetAdd';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/dataset-add" element={<DatasetAdd/>}/>
                <Route path="/catalog" element={<CatalogView/>}/>
                <Route path="/dataset-edit" element={<DatasetEdit/>}/>
            </Routes>
        </div>
    );
}

export default App;
