// TODO: make both service and gateway into one file called dataset-get.ts or dataset-catalog.ts or dataset-index.ts
import {CatalogGateway} from "./dataset-catalog-gateway";
import {Catalog} from "../types/catalog";

export interface BreadcrumbItem {
    id: string;
    title: string;
}

export interface RenderState {
    loading: boolean;
    error: string | null;
    currentCatalog: Catalog | null;
    breadcrumb: BreadcrumbItem[];
}

export class CatalogService {
    private rootCatalog: Catalog | null = null;
    private path: string[] = [];
    private loading: boolean = true;
    private error: string | null = null;
    private catalogGateway: CatalogGateway;

    constructor() {
        this.catalogGateway = new CatalogGateway();
    }

    public async fetchCatalog() {
        try {
            this.loading = true;
            this.rootCatalog = await this.catalogGateway.fetchCatalog();
            this.rootCatalog.id = this.rootCatalog.id || "root";
            this.path = this.rootCatalog && this.rootCatalog.id ? [this.rootCatalog.id] : [];
            this.error = null;
        } catch (err) {
            this.error = 'Failed to load catalog';
        } finally {
            this.loading = false;
        }
    }

    public navigateTo(subCatalogId: string) {
        const current = this.getCurrentCatalog();
        if (current && current.subCatalogs?.some(c => c.id === subCatalogId)) {
            this.path.push(subCatalogId);
        }
    }

    public goBack() {
        if (this.path.length > 1) {
            this.path.pop();
        }
    }

    public setPath(newPath: string[]) {
        if (this.rootCatalog && newPath[0] === this.rootCatalog.id) {
            this.path = newPath;
        }
    }

    public getCurrentCatalog(): Catalog | null {
        if (!this.rootCatalog) return null;
        let current: Catalog | undefined = this.rootCatalog;
        for (const id of this.path.slice(1)) {
            current = current.subCatalogs?.find((c) => c.id === id);
            if (!current) return null;
        }
        return current;
    }

    public getBreadcrumb(): BreadcrumbItem[] {
        const items: BreadcrumbItem[] = [];
        if (!this.rootCatalog) return items;
        let current: Catalog | undefined = this.rootCatalog;
        for (let i = 0; i < this.path.length; i++) {
            const id = this.path[i];
            // add the current item to the breadcrumb
            if (current && current.id === id) {
                items.push({id: current.id, title: current.title});
                // if there is a next item in the path, update current
                if (i < this.path.length - 1) {
                    current = current.subCatalogs?.find((c) => c.id === this.path[i + 1]);
                }
            } else {
                break;
            }
        }
        return items;
    }

    public getState(): RenderState {
        return {
            loading: this.loading,
            error: this.error,
            currentCatalog: this.getCurrentCatalog(),
            breadcrumb: this.getBreadcrumb(),
        } as RenderState;
    }
}