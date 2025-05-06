// todo for future use with backend
import { Catalog } from '../types/catalog';

const API_BASE_URL = '/api/datasetdefinition';

export const addCatalog = async (payload: Catalog): Promise<Catalog> => {
    const response = await fetch(`${API_BASE_URL}/catalog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            console.error("Failed to parse error response:", e);
        }
        console.error('Failed to add catalog:', response.status, errorData);
        throw new Error(errorData?.message || `Failed to add catalog. Status: ${response.status}`);
    }

    return await response.json();
};

export const checkCatalogNameUniqueness = async (title: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/catalog/check-name?title=${encodeURIComponent(title)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to check catalog name uniqueness');
    }

    const data = await response.json();
    return data.isUnique;
};