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
                        <AppNavbar />
                    </ProtectedRoute>
                }>
                    <Route index element={<Home />} />
                    <Route path="dataset-add" element={<DatasetAdd />} />
                    <Route path="dataschema-add" element={<DataSchemaAdd />} />
                    <Route path="dataschema-catalog" element={<DataSchemaCatalog />} />
                    <Route path="dataset-catalog" element={<DatasetCatalog />} />
                    <Route path="dataset-edit/:datasetId" element={<DatasetEdit />} />
                    <Route path="dataschema-edit/:schemaId" element={<DataSchemaEdit />} />
                    <Route path="dataset-owned" element={<DataSetOwnedCatalog />} />
                    <Route path="datasetdistribution/:datasetId" element={<DatasetDistributionDownload />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;