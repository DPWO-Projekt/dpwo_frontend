// TODO: make both service and gateway into one file called dataset-get.ts or dataset-catalog.ts or dataset-index.ts
import { Catalog } from "../types/catalog";

export class CatalogGateway {
    public async fetchCatalog(): Promise<Catalog> {
        const response = await fetch('/api/datasetdefinition');
        if (!response.ok) {
            throw new Error('Failed to fetch catalog');
        }

        const datasets = await response.json();

        return  {
            id: 1,
            title: 'Weather Data',
            description: 'Weather data from various sources',
            datasets: datasets,
        } as Catalog;
    }
}