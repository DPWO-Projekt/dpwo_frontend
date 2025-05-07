import './App.css';
import {Route, Routes} from "react-router";
import Home from "./features/home/components/home";
import DatasetCatalog from './features/dataset/components/dataset-catalog';
import DatasetEdit from './features/dataset/components/dataset-edit';
import DatasetAdd from './features/dataset/components/dataset-add';
import DataSchemaAdd from './features/dataschema/components/dataschema-add';
import DataSchemaEdit from './features/dataschema/components/dataschema-edit';
import { ToastContainer } from 'react-toastify';
import DataSchemaCatalog from './features/dataschema/components/dataschema-catalog';

function App() {
    return (
        <div>
            <ToastContainer />
            <Routes>
                {/* Home routes */}
                <Route path="/" element={<Home/>}/>
            
                {/* Dataset routes */}
                <Route path="/dataset-catalog" element={<DatasetCatalog/>}/>
                <Route path="/dataset-add" element={<DatasetAdd/>}/>
                <Route path="/dataset-edit/:datasetId" element={<DatasetEdit/>}/>
            
                {/* Dataschema rotues */}
                <Route path="/dataschema-catalog" element={<DataSchemaCatalog/>}/>
                <Route path="/dataschema-add" element={<DataSchemaAdd/>}/>
                <Route path="/dataschema-edit/:schemaId" element={<DataSchemaEdit/>}/>
            </Routes>
        </div>
    );
}

export default App;
