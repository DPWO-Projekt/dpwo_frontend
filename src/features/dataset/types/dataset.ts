import {VCard} from "./v-card";
import {LanguageSpecificDatasetInfo} from "./language-specific-dataset-info";
import { DatasetDistribution } from "../../datasetdistribution/types/datasetdistribution";

export interface Dataset {
    id?: string;
    uri: string;
    theme: string;
    vCard?: VCard;
    languageSpecificDatasetInfo: LanguageSpecificDatasetInfo[];
    schemaId: string;
}