import React, {FC, useEffect, useRef, useState} from 'react';
import {Button, Card, Container, Form, Table} from 'react-bootstrap';
import {ChevronRight, Pencil, Trash} from 'react-bootstrap-icons';
import {CatalogService, RenderState} from "../../service/CatalogService";
import { useNavigate } from 'react-router';

interface CatalogProps {
}

const CatalogView: FC<CatalogProps> = () => {
    const catalogServiceRef = useRef(new CatalogService());
    const catalogService = catalogServiceRef.current;

    const [renderState, setRenderState] = useState<RenderState | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            await catalogService.fetchCatalog();
            setRenderState(catalogService.getState());
        };
        loadData().then();
    }, []);

    const handleNavigate = (subCatalogId: number) => {
        catalogService.navigateTo(subCatalogId);
        setRenderState(catalogService.getState());
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

    if (!renderState) {
        return (<div
            style={{
                backgroundColor: '#ece9e2',
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
                backgroundColor: '#ece9e2',
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
                backgroundColor: '#ece9e2',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            No catalog data available
        </div>);
    }

    const {breadcrumb, currentCatalog} = renderState;
    const showBackButton = breadcrumb.length > 1;
    const subCatalogs = currentCatalog.catalogs || [];
    const datasets = currentCatalog.datasets || [];

    return (<div style={{backgroundColor: '#ece9e2', minHeight: '100vh'}}>
        <Container fluid className="d-flex justify-content-center pt-5">
            <Card className="col-8" style={{borderRadius: '10px'}}>
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
                        style={{marginBottom: '10px', marginTop: '10px'}}
                    >
                        Back
                    </Button>)}

                    {/* Table */}
                    <Table hover>
                        <thead>
                        <tr>
                            <th>
                                <Form.Check type="checkbox"/>
                            </th>
                            <th>Catalog / Dataset name</th>
                            <th>Applied Schema</th>
                            <th>Last update</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Sub-Catalogs */}
                        {subCatalogs.map((subCatalog) => (<tr key={subCatalog.id}>
                            <td>
                                <Form.Check type="checkbox"/>
                            </td>
                            <td>
                                <span>📁 {subCatalog.title}</span>
                            </td>
                            <td>-</td>
                            <td>21 Jan 2013</td>
                            <td>
                                <ChevronRight
                                    onClick={() => handleNavigate(subCatalog.id)}
                                    style={{cursor: 'pointer'}}
                                />
                            </td>
                        </tr>))}

                        {/* Datasets */}
                        {datasets.map((dataset) => (<tr key={dataset.id}>
                            <td>
                                <Form.Check type="checkbox"/>
                            </td>
                            <td>
                                            <span>
                                                📄{' '}
                                                {dataset.languageSpecificDatasetInfo[0]?.title || 'Untitled Dataset'}
                                            </span>
                            </td>
                            <td>{dataset.dataScheme?.name || 'not defined'}</td>
                            <td>21 Jan 2013</td>
                            <td>
                                <Pencil
                                    style={{cursor: 'pointer', marginRight: '10px'}}
                                />
                                <Trash style={{cursor: 'pointer'}}/>
                            </td>
                        </tr>))}
                        </tbody>
                    </Table>

                    {/* Add Dataset Button */}
                    <div className="d-flex justify-content-center">
                        <Button
                            style={{
                                backgroundColor: '#28a745',
                                borderColor: '#28a745',
                                borderRadius: '20px',
                                padding: '5px 20px',
                            }}
                            onClick={() => navigate("/dataset-add")}
                        >
                            Add definition of dataset
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    </div>);
};

export default CatalogView;