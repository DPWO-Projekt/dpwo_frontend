import { Availability } from "./availability";

export interface DatasetDistribution {
    id: string;
    url: string;
    availability: Availability;
    format: string;
    title: string;
    description: string;
}