import React from 'react';
import './App.css';
import {Route, Routes} from "react-router";
import Catalog from "./components/Catalog/Catalog";
import Home from "./components/Home/Home";
import AddDataSet from './components/AddDataSet/AddDataSet';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/catalog" element={<Catalog/>}/>
                <Route path="/adddataset" element={<AddDataSet/>}/>
            </Routes>
        </div>
    );
}

export default App;
