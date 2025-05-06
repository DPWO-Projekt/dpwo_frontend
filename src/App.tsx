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
import Register from './features/auth/components/register';
import Login from './features/auth/components/login';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

function App() {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataset-add" element={
                    <ProtectedRoute>
                        <DatasetAdd/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataschema-add" element={
                    <ProtectedRoute>
                        <DataSchemaAdd/>
                    </ProtectedRoute>
                }/>
                <Route path="/catalog" element={
                    <ProtectedRoute>
                        <DatasetCatalog/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataschema-catalog" element={
                    <ProtectedRoute>
                        <DataSchemaCatalog/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataset-edit/:datasetId" element={
                    <ProtectedRoute>
                        <DatasetEdit/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataschema-edit/:dataschemaId" element={
                    <ProtectedRoute>
                        <DataSchemaEdit/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </div>
    );
}

export default App;
