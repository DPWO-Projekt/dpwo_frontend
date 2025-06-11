import { DatasetDistribution } from "../types/datasetdistribution";

const API_BASE_URL = '/api/datasetdefinition/';

export const getDatasetDistributions = async (datasetId: string): Promise<DatasetDistribution[]> =>{
    const response = await fetch(`${API_BASE_URL}` + datasetId + `/distributions`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }
      console.error('Failed to fetch distribtutions:', response.status, errorData);
      throw new Error(errorData?.message || `Failed to fetch distribtutions. Status: ${response.status}`);
    }

    const data: DatasetDistribution[] = await response.json();
    return data;
}