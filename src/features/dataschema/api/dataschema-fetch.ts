import { DataSchema } from '../types/dataschema';

export const fetchDataSchema = async (id: string): Promise<DataSchema> => {
    const apiUrl = `http://localhost:8080/api/dataschema/${encodeURIComponent(id)}`;
  
    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // Indicate we expect JSON in return
          // Add other headers like Authorization if needed
          // 'Authorization': `Bearer ${your_auth_token}`,
        },
      });
    } catch (networkError: any) {
      console.error(`Network error fetching dataschema (ID: ${id}):`, networkError);
      throw new Error(`Network error: ${networkError.message || 'Failed to connect to the server.'}`);
    }
  
    if (!response.ok) {
      let errorData: any = { message: `API Error: ${response.status} ${response.statusText}` };
      try {
        const responseBody = await response.text();
        if (responseBody) {
            errorData = JSON.parse(responseBody);
        }
        console.error(`API Fetch Error Response from ${apiUrl}:`, response.status, errorData);
      } catch (parseError) {
        console.error(`Failed to parse error response body from ${apiUrl}. Status: ${response.status}`);
      }
  
      if (response.status === 404) {
          throw new Error(`Data Schema with ID '${id}' not found.`);
      } else {
          throw new Error(errorData?.message || `Failed to fetch data schema (ID: ${id}). Status: ${response.status}`);
      }
    }
  
    try {
      const data: DataSchema = await response.json();
  
      if (!data || typeof data !== 'object' || !data.id || !data.name || typeof data.properties !== 'object') {
          console.error("Received unexpected data format from API:", data);
          throw new Error("Received invalid data format from the server.");
      }
  
      console.log(`Successfully fetched dataschema (ID: ${id})`);
      return data;
  
    } catch (jsonError: any) {
      console.error(`Error parsing JSON response from ${apiUrl}:`, jsonError);
      throw new Error("Failed to parse server response.");
    }
  };