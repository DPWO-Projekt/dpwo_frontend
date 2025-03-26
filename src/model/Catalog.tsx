import {Dataset} from "./Dataset";

export interface Catalog {
    id: number;
    title: string;
    description: string;
    datasets?: Dataset[];
    catalogs?: Catalog[];
}