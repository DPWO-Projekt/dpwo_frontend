import {FC, useEffect, useRef, useState} from 'react';
import {CatalogService, RenderState} from "../../dataset/api/dataset-catalog-service";
import { Link, useNavigate } from 'react-router';
import { fetchAllDataSchema } from '../api/dataschema-fetchAll';
import { DataSchema } from '../types/dataschema';
import { ChevronRight } from 'react-bootstrap-icons';

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
      <div>
        {dataschemas!.map(schema => (
            <div>
                <div className="station" key={schema.name}>{schema.name}</div>
                <div><ChevronRight
                    onClick={() => navigate('/dataschema-edit/' + schema.id)}
                    style={{cursor: 'pointer'}}
                /></div>
            </div>
        ))}
      </div>
    );
};

export default DataSchemaCatalog;