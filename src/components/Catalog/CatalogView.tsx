import React, {FC, useEffect, useState} from 'react';
import {Button, Card, Container, Form, Table} from 'react-bootstrap';
import {ChevronRight, Pencil, Trash} from 'react-bootstrap-icons';
import {CatalogService} from '../../service/CatalogService';
import {Catalog} from '../../model/Catalog';
import { useNavigate } from 'react-router';

interface CatalogProps {
}

interface BreadcrumbItem {
    id: number;
    title: string;
}

const CatalogView: FC<CatalogProps> = () => {
    const [rootCatalog, setRootCatalog] = useState<Catalog | null>(null);
    const [path, setPath] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const catalogService = new CatalogService();

    const navigate = useNavigate();

    // Fetch the catalog when the component mounts
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                setLoading(true);
                const catalog = await catalogService.fetchCatalog();
                setRootCatalog(catalog);
                setPath([catalog.id]); // Start at the root
                setError(null);
            } catch (err) {
                setError('Failed to load catalog');
            } finally {
                setLoading(false);
            }
        };
        loadCatalog();
    }, []);

    const getCatalogByPath = (root: Catalog, path: number[]): Catalog | null => {
        let current: Catalog | undefined = root;
        for (const id of path.slice(1)) {
            current = current.catalogs?.find((c) => c.id === id);
            if (!current) return null;
        }
        return current;
    };

    const getBreadcrumb = (root: Catalog, path: number[]): BreadcrumbItem[] => {
        const items: BreadcrumbItem[] = [];
        let current: Catalog | undefined = root;
        for (let i = 0; i < path.length; i++) {
            const id = path[i];
            if (current && current.id === id) {
                items.push({id: current.id, title: current.title});
                if (i < path.length - 1) {
                    current = current.catalogs?.find((c) => c.id === path[i + 1]);
                }
            } else {
                break;
            }
        }
        return items;
    };

    const handleNavigate = (subCatalogId: number) => {
        setPath([...path, subCatalogId]);
    };

    const handleBack = () => {
        if (path.length > 1) {
            setPath(path.slice(0, -1));
        }
    };

    if (loading) {
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

    if (error) {
        return (<div
                style={{
                    backgroundColor: '#ece9e2',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                Error: {error}
            </div>);
    }

    if (!rootCatalog) {
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

    const currentCatalog = getCatalogByPath(rootCatalog, path);
    if (!currentCatalog) {
        return (<div
                style={{
                    backgroundColor: '#ece9e2',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                Invalid catalog path
            </div>);
    }

    const breadcrumbItems = getBreadcrumb(rootCatalog, path);

    return (<div style={{backgroundColor: '#ece9e2', minHeight: '100vh'}}>
            <Container fluid className="d-flex justify-content-center pt-5">
                <Card className="col-8" style={{borderRadius: '10px'}}>
                    <Card.Header
                        style={{backgroundColor: '#ece9e2', color: '#2c3e50', fontWeight: 'bold'}}
                        className="text-center"
                    >
                        Datasets catalog
                    </Card.Header>
                    <Card.Body>
                        {/* Breadcrumb Navigation */}
                        <div>
                            {breadcrumbItems.map((item, index) => (<span key={item.id}>
                                    {index > 0 && ' > '}
                                    <a href="#" onClick={() => setPath(path.slice(0, index + 1))}>
                                        {item.title}
                                    </a>
                                </span>))}
                        </div>
                        {/* Back Button */}
                        {path.length > 1 && (
                            <Button onClick={handleBack} style={{marginBottom: '10px', marginTop: '10px'}}>
                                Back
                            </Button>)}
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
                            {currentCatalog.catalogs?.map((subCatalog) => (<tr key={subCatalog.id}>
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
                            {currentCatalog.datasets?.map((dataset) => (<tr key={dataset.id}>
                                    <td>
                                        <Form.Check type="checkbox"/>
                                    </td>
                                    <td>
                                        <span>📄 {dataset.languageSpecificDatasetInfo[0]?.title || 'Untitled Dataset'}</span>
                                    </td>
                                    <td>{dataset.dataScheme?.name || 'not defined'}</td>
                                    <td>21 Jan 2013</td>
                                    <td>
                                        <Pencil style={{cursor: 'pointer', marginRight: '10px'}}/>
                                        <Trash style={{cursor: 'pointer'}}/>
                                    </td>
                                </tr>))}
                            </tbody>
                        </Table>
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