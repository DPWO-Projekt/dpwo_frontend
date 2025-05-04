import {Property} from "./property";

export interface DataSchema {
    id: string;
    name: string;
    properties: Property[];
}