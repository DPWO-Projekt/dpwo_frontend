// TODO: make both service and gateway into one file called dataset-get.ts or dataset-catalog.ts or dataset-index.ts
import { Catalog } from "../types/catalog";

export class CatalogGateway {
    public async fetchCatalog(): Promise<Catalog> {
        const response = await fetch('/api/catalog');
        if (!response.ok) {
            throw new Error('Failed to fetch catalog');
        }

        return await response.json() as Catalog;
    }
}