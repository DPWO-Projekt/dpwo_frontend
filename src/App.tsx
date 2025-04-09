import React from 'react';
import './App.css';
import {Route, Routes} from "react-router";
import Home from "./components/Home/Home";
import CatalogView from "./components/Catalog/CatalogView";
import DatasetEdit from './components/DatasetEdit/DatasetEdit';
import DatasetAdd from './components/DatasetAdd/DatasetAdd';
import DataSchemaAdd from './components/DataSchemaAdd/DataSchemaAdd';
import DataSchemaEdit from './components/DataSchemaEdit/DataSchemaEdit';
import { ToastContainer } from 'react-toastify';
import DataSchemaCatalog from './components/DataSchemaCatalog/DataSchemaCatalog';

function App() {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/dataset-add" element={<DatasetAdd/>}/>
                <Route path="/dataschema-add" element={<DataSchemaAdd/>}/>
                <Route path="/catalog" element={<CatalogView/>}/>
                <Route path="/dataschema-catalog" element={<DataSchemaCatalog/>}/>
                <Route path="/dataset-edit" element={<DatasetEdit/>}/>
                <Route path="/dataschema-edit" element={<DataSchemaEdit/>}/>
            </Routes>
        </div>
    );
}

export default App;
