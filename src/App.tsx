import './App.css';
import { Route, Routes } from "react-router";
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
import DataSetOwnedCatalog from './features/dataset/components/dataset-owned-catalog';
import DatasetDistributionDownload from './features/datasetdistribution/components/datasetdistribution-download';
import DatasetDistributionAdd from './features/datasetdistribution/components/datasetdistribution-add';
import AppNavbar from "./features/navbar/components/AppNavbar";

function App() {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                }/>
                <Route path="/logout" element={
                    <ProtectedRoute>
                        <AppNavbar/>
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
                <Route path="/dataschema-catalog" element={
                    <ProtectedRoute>
                        <DataSchemaCatalog/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataset-catalog" element={
                    <ProtectedRoute>
                        <DatasetCatalog/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataset-edit/:datasetId" element={
                    <ProtectedRoute>
                        <DatasetEdit/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataschema-edit/:schemaId" element={
                    <ProtectedRoute>
                        <DataSchemaEdit/>
                    </ProtectedRoute>
                }/>
                <Route path="/dataset-owned" element={
                    <ProtectedRoute>
                        <DataSetOwnedCatalog/>
                    </ProtectedRoute>
                }/>
                <Route path="/datasetdistribution-add/:datasetId/" element={
                    <ProtectedRoute>
                        <DatasetDistributionAdd/>
                    </ProtectedRoute>
                }/>
                <Route path="/datasetdistribution/:datasetId" element={
                    <ProtectedRoute>
                        <DatasetDistributionDownload/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </div>
    );
}

export default App;