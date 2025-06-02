import { Dataset } from "../types/dataset";

const API_BASE_URL = '/api/datasetdefinition';

export const getAllDatasets = async (): Promise<Dataset[]> =>{
    const response = await fetch(`${API_BASE_URL}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }
      console.error('Failed to fetch dataset:', response.status, errorData);
      throw new Error(errorData?.message || `Failed to fetch dataset. Status: ${response.status}`);
    }

    const data: Dataset[] = await response.json();
    return data;
}