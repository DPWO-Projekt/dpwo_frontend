// src/services/CatalogService.ts
import { CatalogGateway } from './CatalogGateway';
import { Catalog } from '../model/Catalog';
import { Dataset } from '../model/Dataset';
import { ReactNode } from 'react';

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

export class CatalogService {
    private catalog: Catalog | null = null;
    private loading: boolean = true;
    private error: string | null = null;

    public async fetchAndRender(
        renderCallback: (props: RenderProps) => ReactNode
    ): Promise<ReactNode> {
        try {
            this.loading = true;
            this.catalog = await CatalogGateway.fetchCatalog();
            this.error = null;
        } catch (err) {
            this.error = 'Failed to load catalog data';
        } finally {
            this.loading = false;
        }

        const tableData = this.flattenCatalog();
        return renderCallback({
            loading: this.loading,
            error: this.error,
            tableData,
            hasCatalog: this.catalog !== null,
        });
    }

    // Flatten the catalog hierarchy into table rows
    private flattenCatalog(level: number = 0): TableRow[] {
        const rows: TableRow[] = [];

        if (!this.catalog) {
            return rows;
        }

        rows.push({
            id: this.catalog.id,
            name: this.catalog.title,
            schema: '-',
            lastUpdate: '21 Jan 2013',
            actions: ['navigate'],
            isCatalog: true,
            level,
        });

        if (this.catalog.datasets && this.catalog.datasets.length > 0) {
            this.catalog.datasets.forEach((dataset: Dataset) => {
                rows.push({
                    id: dataset.id,
                    name: dataset.languageSpecificDatasetInfo[0]?.title || 'Untitled Dataset',
                    schema: dataset.dataScheme?.name || 'not defined',
                    lastUpdate: '21 Jan 2013',
                    actions: ['edit', 'delete'],
                    isCatalog: false,
                    level: level + 1,
                });
            });
        }

        if (this.catalog.catalogs && this.catalog.catalogs.length > 0) {
            this.catalog.catalogs.forEach((subCatalog: Catalog) => {
                const subService = new CatalogService();
                subService.catalog = subCatalog;
                rows.push(...subService.flattenCatalog(level + 1));
            });
        }

        return rows;
    }
}