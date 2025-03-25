// src/components/CatalogView.tsx
import React, { FC, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { ChevronRight, Pencil, Trash } from 'react-bootstrap-icons';
import {Catalog} from "../../model/Catalog";
import {CatalogGateway} from "../../service/CatalogGateway";
import {Dataset} from "../../model/Dataset";

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

const CatalogView: FC<CatalogProps> = () => {
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const path = '/catalog';

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                setLoading(true);
                const fetchedCatalog = await CatalogGateway.fetchCatalog();
                setCatalog(fetchedCatalog);
            } catch (err) {
                setError('Failed to load catalog data');
            } finally {
                setLoading(false);
            }
        };

        loadCatalog();
    }, []);

    // Function to flatten the catalog hierarchy into table rows
    const flattenCatalog = (cat: Catalog, level: number = 0): TableRow[] => {
        const rows: TableRow[] = [];

        // Add the catalog itself as a row
        rows.push({
            id: cat.id,
            name: cat.title,
            schema: '-',
            lastUpdate: '21 Jan 2013', // Mocked static date as per original
            actions: ['navigate'],
            isCatalog: true,
            level,
        });

        // Add datasets under this catalog
        if (cat.datasets && cat.datasets.length > 0) {
            cat.datasets.forEach((dataset: Dataset) => {
                rows.push({
                    id: dataset.id,
                    name: dataset.languageSpecificDatasetInfo[0]?.title || 'Untitled Dataset',
                    schema: dataset.dataScheme?.name || 'not defined',
                    lastUpdate: '21 Jan 2013', // Mocked static date
                    actions: ['edit', 'delete'],
                    isCatalog: false,
                    level: level + 1,
                });
            });
        }

        // Recursively add sub-catalogs
        if (cat.catalogs && cat.catalogs.length > 0) {
            cat.catalogs.forEach((subCatalog: Catalog) => {
                rows.push(...flattenCatalog(subCatalog, level + 1));
            });
        }

        return rows;
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#ece9e2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ backgroundColor: '#ece9e2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Error: {error}
            </div>
        );
    }

    if (!catalog) {
        return (
            <div style={{ backgroundColor: '#ece9e2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                No catalog data available
            </div>
        );
    }

    // Flatten the catalog data into table rows
    const tableData = flattenCatalog(catalog);

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

export default CatalogView;