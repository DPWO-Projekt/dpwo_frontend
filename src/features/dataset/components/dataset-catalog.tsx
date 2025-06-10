import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Card, Container, Dropdown, Form, Table } from 'react-bootstrap';
import { ChevronRight, Pencil, Trash } from 'react-bootstrap-icons';
import { CatalogService, RenderState } from '../api/dataset-catalog-service';
import { fetchAllDataSchema } from '../../dataschema/api/dataschema-fetchAll'
import { useNavigate } from 'react-router';
import CatalogAddModal from './catalog-add-modal';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { Dataset } from '../types/dataset';
import { DataSchema } from '../../dataschema/types/dataschema';
import { setDataSchema } from '../api/dataset-set-dataschema';
import { AuthService } from '../../auth/services/auth.service';

interface DatasetCatalogProps {
}

const DatasetCatalog: FC<DatasetCatalogProps> = () => {
    const catalogServiceRef = useRef(new CatalogService());
    const catalogService = catalogServiceRef.current;

    const [renderState, setRenderState] = useState<RenderState | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [dataschemas, setDataSchemas] = useState<DataSchema[]>()
    const [userRole, setUserRole] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        setUserRole(AuthService.getUserRole());
        const loadData = async () => {
            await catalogService.fetchCatalog();
            setDataSchemas(await fetchAllDataSchema());
            setRenderState(catalogService.getState());
        };
        loadData();
    }, []);

    const handleNavigate = (subCatalogId: string | undefined) => {
        if (subCatalogId) {
            catalogService.navigateTo(subCatalogId);
            setRenderState(catalogService.getState());
        }
    };

    const handleBack = () => {
        catalogService.goBack();
        setRenderState(catalogService.getState());
    };

    const handleBreadcrumbClick = (index: number) => {
        if (renderState) {
            const newPath = renderState.breadcrumb.slice(0, index + 1).map((i) => i.id);
            catalogService.setPath(newPath);
            setRenderState(catalogService.getState());
        }
    };

    const handleSetDataschema = async (datasetId: string, dataschemaId: string) => {
        const response = await setDataSchema(datasetId, dataschemaId);
        if (response.ok) {
            await catalogService.fetchCatalog()
            setRenderState(catalogService.getState());
        }
    }

    if (!renderState) {
        return (<div
            style={{
                backgroundColor: '#f6f4ec',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            Loading...
        </div>);
    }

    if (renderState.error) {
        return (<div
            style={{
                backgroundColor: '#f6f4ec',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            Error: {renderState.error}
        </div>);
    }

    if (!renderState.currentCatalog) {
        return (<div
            style={{
                backgroundColor: '#f6f4ec',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            No catalog data available
        </div>);
    }

    const { breadcrumb, currentCatalog } = renderState;
    const showBackButton = breadcrumb.length > 1;
    const subCatalogs = currentCatalog?.subCatalogs || [];
    const datasets = currentCatalog.datasets || [];

    return (<div style={{ backgroundColor: '#f6f4ec', minHeight: '100vh', padding: '50px' }}>
        <div>
            <BackButtonComponent to='/' />
        </div>
        <Container fluid className="d-flex justify-content-center pt-5">
            <Card className="col-8" style={{ borderRadius: '10px' }}>
                <Card.Header
                    style={{
                        backgroundColor: '#ece9e2', color: '#2c3e50', fontWeight: 'bold',
                    }}
                    className="text-center"
                >
                    Datasets catalog
                </Card.Header>
                <Card.Body>
                    {/* Breadcrumb */}
                    <div>
                        {breadcrumb.map((item, index) => (<span key={item.id}>
                            {index > 0 && ' > '}
                            <a href="#" onClick={() => handleBreadcrumbClick(index)}>
                                {item.title}
                            </a>
                        </span>))}
                    </div>

                    {/* Back Button */}
                    {showBackButton && (<Button
                        onClick={handleBack}
                        style={{ marginBottom: '10px', marginTop: '10px' }}
                    >
                        Back
                    </Button>)}

                    {/* Table */}
                    <Table hover>
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check type="checkbox" />
                                </th>
                                <th>Catalog / Dataset name</th>
                                <th>Applied Schema Id</th>
                                <th>Last update</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sub-Catalogs */}
                            {subCatalogs.map((subCatalog) => (<tr key={subCatalog.id}>
                                <td>
                                    <Form.Check type="checkbox" />
                                </td>
                                <td>
                                    <span>📁 {subCatalog.title}</span>
                                </td>
                                <td>-</td>
                                <td>21 Jan 2013</td>
                                <td>
                                    <ChevronRight
                                        onClick={() => handleNavigate(subCatalog.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </td>
                            </tr>))}

                            {/* Datasets */}
                            {datasets.map((dataset) => (<tr key={dataset.id}>
                                <td>
                                    <Form.Check type="checkbox" />
                                </td>
                                <td>
                                    <span>
                                        📄 {dataset.theme || 'Untitled Dataset'}
                                    </span>
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            {
                                                dataschemas
                                                    ?.find(ds => ds.id === dataset.schemaId)
                                                    ?.name
                                                ?? 'Choose a schema'
                                            }
                                        </Dropdown.Toggle>

                                        
                                            <Dropdown.Menu>
                                                {dataschemas?.map((dataschema) =>
                                                    <Dropdown.Item onClick={() => handleSetDataschema(dataset.id!, dataschema.id)}>{dataschema.name}</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>

                                    </Dropdown>
                                </td>
                                <td>21 Jan 2013</td>
                                <td>
                                    {userRole === 'DATA_USER' ? (
                                        <Button
                                            className="me-1"
                                            style={{
                                                backgroundColor: '#28a745',
                                                borderColor: '#28a745',
                                                borderRadius: '20px',
                                                padding: '5px 20px',
                                            }}
                                            onClick={() => navigate(`/datasetdistribution/${dataset.id}`)}
                                        >
                                            Download distribution
                                        </Button>
                                    ) : (
                                        <>
                                            <Pencil
                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                                onClick={() => navigate(`/dataset-edit/${dataset.id}`, { state: { parentCatalog: currentCatalog.id } })}
                                            />
                                            <Trash style={{ cursor: 'pointer' }} />
                                        </>
                                    )}
                                </td>
                            </tr>))}
                        </tbody>
                    </Table>

                    {/* Add Dataset and Catalog Buttons */}
                    <div className="d-flex justify-content-center">
                        <Button
                            className="me-1"
                            style={{
                                backgroundColor: '#28a745',
                                borderColor: '#28a745',
                                borderRadius: '20px',
                                padding: '5px 20px',
                            }}
                            onClick={() => navigate('/dataset-add', { state: { parentCatalog: currentCatalog.id } })}
                        >
                            Add definition of dataset
                        </Button>
                        <Button
                            className="ms-1"
                            style={{
                                backgroundColor: '#ece9e2',
                                borderColor: '#ece9e2',
                                borderRadius: '20px',
                                padding: '5px 20px',
                            }}
                            onClick={() => setShowAddModal(true)}
                        >
                            <span style={{ color: 'black' }}>New catalog</span>
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>

        {/* Add Catalog Modal */}
        <CatalogAddModal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            catalogService={catalogService}
        />
    </div>);
};

export default DatasetCatalog;