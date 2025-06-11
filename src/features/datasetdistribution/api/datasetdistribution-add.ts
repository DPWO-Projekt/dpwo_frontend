import { DatasetDistribution } from "../types/datasetdistribution";

const API_BASE_URL = '/api/datasetdefinition/';

interface DatasetDistributionAddPayload {
  url: string;
  availability: string;
  format: string;
  title: string;
  description: string;
}

export const addDatasetDistribution = async (datasetId: string, payload: DatasetDistributionAddPayload): Promise<DatasetDistribution> =>{
  const response = await fetch(`${API_BASE_URL}` + datasetId + `/distributions`,{
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
    console.error('Failed to add distribtutions:', response.status, errorData);
    throw new Error(errorData?.message || `Failed to add distribtutions. Status: ${response.status}`);
  }

  return await response.json();
}