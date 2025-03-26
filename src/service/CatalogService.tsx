// src/services/CatalogService.ts
import { CatalogGateway } from './CatalogGateway';
import { Catalog } from '../model/Catalog';

export class CatalogService {
    public async fetchCatalog(): Promise<Catalog> {
        try {
            return await CatalogGateway.fetchCatalog();
        } catch (err) {
            throw new Error('Failed to load catalog data');
        }
    }
}