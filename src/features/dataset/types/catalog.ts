import {Dataset} from "./dataset";

export interface Catalog {
    id: number;
    title: string;
    description: string;
    datasets?: Dataset[];
    catalogs?: Catalog[];
}