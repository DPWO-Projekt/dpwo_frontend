import {Catalog} from "../model/Catalog";
import exp from "constants";

export class CatalogGateway {
    public static async fetchCatalog(): Promise<Catalog> {

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
            id: 1,
            title: "Main Research Catalog",
            description: "A catalog containing research datasets and sub-catalogs",
            datasets: [
                {
                    id: 101,
                    theme: "Environmental Science",
                    languageSpecificDatasetInfo: [
                        {
                            title: "Climate Change Data (English)",
                            description: "Dataset containing climate change metrics in English",
                            keywords: ["climate", "temperature", "emissions"],
                            language: "en",
                        },
                        {
                            title: "Datos de Cambio Climático (Spanish)",
                            description: "Conjunto de datos sobre métricas de cambio climático en español",
                            keywords: ["clima", "temperatura", "emisiones"],
                            language: "es",
                        },
                    ],
                    dataScheme: {
                        name: "Climate Metrics Scheme",
                        properties: [
                            {name: "year", type: "number"},
                            {name: "averageTemp", type: "number"},
                            {name: "region", type: "string"},
                        ],
                    },
                    vCard: [
                        {
                            authorNames: ["Dr. Alice Brown"],
                            relatedWebsites: ["https://climate-research.org"],
                            orgs: ["Climate Research Institute"],
                            contactMails: ["alice.brown@research.org"],
                        },
                        {
                            authorNames: ["Prof. Bob Carter"],
                            relatedWebsites: ["https://env-data.gov"],
                            orgs: ["Environmental Agency"],
                            contactMails: ["bob.carter@env-agency.gov"],
                        },
                    ],
                },
                {
                    id: 102,
                    theme: "Health Science",
                    languageSpecificDatasetInfo: [
                        {
                            title: "Public Health Statistics (English)",
                            description: "Dataset on public health trends in English",
                            keywords: ["health", "disease", "statistics"],
                            language: "en",
                        },
                    ],
                    dataScheme: {
                        name: "Health Metrics Scheme",
                        properties: [
                            {name: "diseaseName", type: "string"},
                            {name: "cases", type: "number"},
                            {name: "year", type: "number"},
                        ],
                    },
                    vCard: [
                        {
                            authorNames: ["Dr. Clara Davis"],
                            relatedWebsites: ["https://health-stats.org"],
                            orgs: ["Public Health Organization"],
                            contactMails: ["clara.davis@health-org.org"],
                        },
                    ],
                },
            ],
            catalogs: [
                {
                    id: 2,
                    title: "Sub-Catalog: Energy Research",
                    description: "A sub-catalog focusing on energy-related datasets",
                    datasets: [
                        {
                            id: 201,
                            theme: "Renewable Energy",
                            languageSpecificDatasetInfo: [
                                {
                                    title: "Solar Energy Data",
                                    description: "Dataset on solar energy production",
                                    keywords: ["solar", "energy", "renewable"],
                                    language: "en",
                                },
                            ],
                            dataScheme: {
                                name: "Energy Production Scheme",
                                properties: [
                                    {name: "year", type: "number"},
                                    {name: "productionMWh", type: "number"},
                                    {name: "source", type: "string"},
                                ],
                            },
                            vCard: [
                                {
                                    authorNames: ["Dr. David Evans"],
                                    relatedWebsites: ["https://energy-research.org"],
                                    orgs: ["Energy Research Group"],
                                    contactMails: ["david.evans@energy.org"],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }

}