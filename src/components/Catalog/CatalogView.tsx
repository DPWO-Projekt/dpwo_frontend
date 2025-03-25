// src/components/CatalogView.tsx
import React, { FC, useEffect, useState, ReactNode } from 'react';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';
import { ChevronRight, Pencil, Trash } from 'react-bootstrap-icons';
import {CatalogService} from "../../service/CatalogService";

interface CatalogProps {}

interface TableRow {
    id: number;
    name: string;
    schema: string;
    lastUpdate: string;
    actions: string[];
    isCatalog: boolean;
    level: number;
}

interface RenderProps {
    loading: boolean;
    error: string | null;
    tableData: TableRow[];
    hasCatalog: boolean;
}

const CatalogView: FC<CatalogProps> = () => {
    const [content, setContent] = useState<ReactNode>(null);
    const catalogService = new CatalogService();
    const path = '/catalog';

    const renderContent = ({ loading, error, tableData, hasCatalog }: RenderProps): ReactNode => {
        if (loading) {
            return (
                <div
                    style={{
                        backgroundColor: '#ece9e2',
                        minHeight: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    Loading...
                </div>
            );
        }

        if (error) {
            return (
                <div
                    style={{
                        backgroundColor: '#ece9e2',
                        minHeight: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    Error: {error}
                </div>
            );
        }

        if (!hasCatalog) {
            return (
                <div
                    style={{
                        backgroundColor: '#ece9e2',
                        minHeight: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    No catalog data available
                </div>
            );
        }

        return (
            <div style={{ backgroundColor: '#ece9e2', minHeight: '100vh' }}>
                <Container fluid className="d-flex justify-content-center pt-5">
                    <Card className="col-8" style={{ borderRadius: '10px' }}>
                        <Card.Header
                            style={{ backgroundColor: '#ece9e2', color: '#2c3e50', fontWeight: 'bold' }}
                            className="text-center"
                        >
                            Datasets catalog
                        </Card.Header>
                        <Card.Body>
                            {path}
                            <Table hover>
                                <thead>
                                <tr>
                                    <th>
                                        <Form.Check type="checkbox" />
                                    </th>
                                    <th>Catalog / Dataset name</th>
                                    <th>Applied Schema</th>
                                    <th>Last update</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <Form.Check type="checkbox" />
                                        </td>
                                        <td>
                        <span style={{ marginLeft: `${row.level * 20}px`, marginRight: '5px' }}>
                          {row.isCatalog ? '📁' : '📄'}
                        </span>
                                            {row.name}
                                        </td>
                                        <td>{row.schema}</td>
                                        <td>{row.lastUpdate}</td>
                                        <td>
                                            {row.actions.includes('navigate') && (
                                                <ChevronRight style={{ cursor: 'pointer', marginRight: '10px' }} />
                                            )}
                                            {row.actions.includes('edit') && (
                                                <Pencil style={{ cursor: 'pointer', marginRight: '10px' }} />
                                            )}
                                            {row.actions.includes('delete') && (
                                                <Trash style={{ cursor: 'pointer' }} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <div className="d-flex justify-content-end">
                                <Button
                                    style={{
                                        backgroundColor: '#28a745',
                                        borderColor: '#28a745',
                                        borderRadius: '20px',
                                        padding: '5px 20px',
                                    }}
                                >
                                    Add definition of dataset
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    };

    useEffect(() => {
        const loadData = async () => {
            const renderedContent = await catalogService.fetchAndRender(renderContent);
            setContent(renderedContent);
        };

        loadData().then();
    }, []);

    return <>{content}</>;
};

export default CatalogView;