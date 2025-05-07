import { toast } from 'react-toastify';

const API_BASE_URL = '/api/datasetdefinition/setSchema';


export const setDataSchema = async (datasetId: string, dataschemaId: string): Promise<Response> => {

    const response = await fetch(`${API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "id": datasetId,
                "schemaId": dataschemaId
            }
        ),
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
      } else {
        toast.success('Dataschema assigned successfully');
      }
      return response;
}