import {FC, useEffect, useRef, useState} from 'react';
import {CatalogService, RenderState} from "../../dataset/api/dataset-catalog-service";
import { Link, useNavigate } from 'react-router';
import { fetchAllDataSchema } from '../api/dataschema-fetchAll';
import { DataSchema } from '../types/dataschema';
import { ChevronRight, Pencil, Trash } from 'react-bootstrap-icons';
import styles from '../styles/dataschema-catalog.module.css';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';

interface CatalogProps {
}

const DataSchemaCatalog: FC<CatalogProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [dataschemas, setDataSchemas] = useState<DataSchema[] | null>(null);
    const [renderState, setRenderState] = useState<RenderState | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchAllDataSchema();
            setDataSchemas(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return <div><p>Loading schema data...</p></div>;
    }

    if (fetchError) {
        return <div><p style={{ color: 'red' }}>Error: {fetchError}</p><Link to="/catalog">Go back</Link></div>;
    }

    return (
      <div className={styles.container}>
        <div className={styles.title}>
            Data schemas
        </div>
        <Container fluid className="d-flex justify-content-center pt-5">
            <Card className="col-8" style={{borderRadius: '10px'}}>
                <Table hover className={styles.table}>
                    <thead>
                    <tr>
                        <th>
                            <Form.Check type="checkbox"/>
                        </th>
                        <th>Schema name</th>
                        <th>Last update</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                    {/* Datasets */}
                    {dataschemas!.map((schema) => (<tr key={schema.id}>
                        <td>
                            <Form.Check type="checkbox"/>
                        </td>
                        <td>
                            <span>
                                📄{' '}
                                {schema.name || 'Untitled Dataset'}
                            </span>
                        </td>
                        <td>21 Jan 2013</td>
                        <td>
                            <Pencil
                                style={{cursor: 'pointer', marginRight: '10px'}}
                                onClick={() => navigate(`/dataschema-edit/${schema.id}`)}
                            />
                            <Trash style={{cursor: 'pointer'}}/>
                        </td>
                    </tr>))}
                    </tbody>
                </Table>
            </Card>
        </Container>
        <Button
            style={{
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderRadius: '20px',
                padding: '5px 20px',
                marginTop: '16px'
            }}
            onClick={() => navigate("/dataschema-add")}
        >
            Add definition of dataset
        </Button>
      </div>
    );
};

export default DataSchemaCatalog;