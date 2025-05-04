import {FC, useEffect, useRef, useState} from 'react';
import {CatalogService, RenderState} from "../../dataset/api/dataset-catalog-service";
import { useNavigate } from 'react-router';
interface CatalogProps {
}

const DataSchemaCatalog: FC<CatalogProps> = () => {
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

    return (
      <div>
        PLACEHOLDER
      </div>
    );
};

export default DataSchemaCatalog;