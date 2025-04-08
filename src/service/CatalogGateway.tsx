import {Catalog} from "../model/Catalog";

export class CatalogGateway {
    public async fetchCatalog(): Promise<Catalog> {
        const response = await fetch('/api/dataset');
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