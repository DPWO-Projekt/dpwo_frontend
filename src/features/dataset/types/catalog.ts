import {Dataset} from "./dataset";

export interface Catalog {
    id?: string;
    title: string;
    description: string;
    datasets?: Dataset[];
    subCatalogs?: Catalog[];
    parentCatalog?: string;
}
