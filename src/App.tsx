import React from 'react';
import './App.css';
import {Route, Routes} from "react-router";
import Home from "./components/Home/Home";
import AddDataSet from './components/AddDataSet/AddDataSet';
import CatalogView from "./components/Catalog/CatalogView";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/adddataset" element={<AddDataSet/>}/>
                <Route path="/catalog" element={<CatalogView/>}/>
            </Routes>
        </div>
    );
}

export default App;
