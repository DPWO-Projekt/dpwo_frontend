import {VCard} from "./VCard";
import {LanguageSpecificDatasetInfo} from "./LanguageSpecificDatasetInfo";
import {DataScheme} from "./DataScheme";

export interface Dataset {
    id: number;
    theme: string;
    vCard?: VCard[];
    languageSpecificDatasetInfo: LanguageSpecificDatasetInfo[];
    dataScheme: DataScheme;
}