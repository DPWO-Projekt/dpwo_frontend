import { Dataset } from '../types/dataset';

const API_BASE_URL = '/api/datasetdefinition';

export const editDataset = async (id: string, payload: Dataset): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
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
        console.error('Failed to update dataset:', response.status, errorData);
        throw new Error(errorData?.message || `Failed to update dataset. Status: ${response.status}`);
      }
}