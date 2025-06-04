import {FC, useEffect, useRef, useState} from 'react';
import {CatalogService, RenderState} from "../api/dataset-catalog-service";
import { Link, useNavigate } from 'react-router';
import styles from '../styles/dataset-owned-catalog.module.css';
import { Button, Card, Container, Dropdown, Form, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { Dataset } from '../types/dataset';
import { getAllDatasets } from '../api/dataset-fetchAll';
import { DataSchema } from '../../dataschema/types/dataschema';
import { fetchAllDataSchema } from '../../dataschema/api/dataschema-fetchAll';
import { setDataSchema } from '../api/dataset-set-dataschema';
// import { FaRegFile } from "react-icons/fa";

interface CatalogProps {
}

const DataSetOwnedCatalog: FC<CatalogProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [datasets, setDatasets] = useState<Dataset[] | null>(null);
    const [dataschemas, setDataSchemas] = useState<DataSchema[]>([]);
    const [renderState, setRenderState] = useState<RenderState | null>(null);

    const navigate = useNavigate();

    const handleSetDataschema = async (datasetId: string, dataschemaId: string) => {
        const response = await setDataSchema(datasetId, dataschemaId);
        if (response.ok) {
            setIsLoading(true);
            const data = await getAllDatasets();
            setDatasets(data);
            const schemas = await fetchAllDataSchema();
            setDataSchemas(schemas);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await getAllDatasets();
                setDatasets(data);
                const schemas = await fetchAllDataSchema();
                setDataSchemas(schemas);
                setIsLoading(false);
            } catch (error: any){
                console.error('Failed to fetch datasets:', error);
                toast.error(`Error loading dataset: ${error?.message || 'Unknown error'}`);
                setFetchError(error?.message || 'Failed to load schema data.');
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return <div className={styles.info}><p>Loading schema data...</p></div>;
    }

    if (fetchError) {
        return <div className={styles.info}><p style={{ color: 'red' }}>Error: {fetchError}</p><Link to="/">Go back</Link></div>;
    }

    return (
      <div className={styles.container}>
        <div className={styles.backBtn}>
            <BackButtonComponent to='/' />
        </div>
        <div className={styles.title}>
            Owned Datasets
        </div>
        <Container fluid className="d-flex justify-content-center pt-5">
            <Card className="col-8" style={{borderRadius: '10px'}}>
                <Table hover className={styles.table}>
                    <thead>
                    <tr>
                        <th>
                            <Form.Check type="checkbox"/>
                        </th>
                        <th>Dataset name</th>
                        <th>Applied Schema</th>
                        <th>Last update</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                    {/* Datasets */}
                    {datasets!.map((dataset) => (<tr key={dataset.id}>
                        <td>
                            <Form.Check type="checkbox"/>
                        </td>
                        <td>
                            <span>
                                {!dataset.datasetdistribution && '📄'}
                                {dataset.theme || 'Untitled Dataset'}
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
                                    {dataschemas.map((dataschema) =>
                                        <Dropdown.Item onClick={() => handleSetDataschema(dataset.id!, dataschema.id)}>{dataschema.name}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                        <td>21 Jan 2013</td>
                        <td>
                            <button className={styles.attachButton}>Attach distribution</button>
                            {!dataset.datasetdistribution && <button className={styles.editButton}>Edit</button>} 
                        </td>
                    </tr>))}
                    </tbody>
                </Table>
            </Card>
        </Container>
      </div>
    );
};
//TODO ADD ACTUAL CHECKS FOR DISTRIBUTIONS
export default DataSetOwnedCatalog;