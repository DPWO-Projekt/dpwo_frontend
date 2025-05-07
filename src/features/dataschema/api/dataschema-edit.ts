// src/services/dataSchemaService.ts
import { Property } from '../types/property'; // Adjust path if needed or move Property

interface SchemaPropertyInputItem extends Property {
  id: string;
}

// Interface for the payload expected by the UPDATE API endpoint
interface DataSchemaUpdatePayload {
  name: string; // Renamed from 'name' in the original component state
  properties: Record<string, string>; // Map of property name (key) to property type (value)
}

export const editDataSchema = async (
  dataschemaId: string,
  name: string,
  schemaProperties: SchemaPropertyInputItem[] | Property[]
): Promise<void> => {

  if (!dataschemaId || typeof dataschemaId !== 'string' || dataschemaId.trim() === '') {
    console.error("updateDataSchema error: Invalid or missing dataschemaId provided.");
    throw new Error("Data Schema ID is required for update.");
  }
  if (!name || name.trim() === '') {
    console.error("updateDataSchema error: Title cannot be empty.");
    throw new Error("Data Schema title cannot be empty.");
  }
  if (!Array.isArray(schemaProperties)) {
      console.error("updateDataSchema error: schemaProperties must be an array.");
      throw new Error("Invalid format for schema properties.");
  }


  const propMap: Record<string, string> = {};
  let hasValidProperties = false;
  schemaProperties.forEach(prop => {
    const trimmedName = prop.name ? prop.name.trim() : '';
    if (trimmedName) {
        if (propMap.hasOwnProperty(trimmedName)) {
             console.warn(`Duplicate property name found and will be overwritten: "${trimmedName}"`);
             // Or throw an error if duplicates aren't allowed by the backend/UI validation missed it
             // throw new Error(`Duplicate property name found: "${trimmedName}"`);
        }
        propMap[trimmedName] = prop.type; // Add type (assuming type is always valid)
        hasValidProperties = true;
    } else {
      const uiId = (prop as SchemaPropertyInputItem).id ? ` (UI ID: ${(prop as SchemaPropertyInputItem).id})` : '';
      console.warn(`Skipping property with empty name${uiId}`);
    }
  });

  const payload: DataSchemaUpdatePayload = {
    name: name.trim(),
    properties: propMap,
  };

  const apiUrl = `http://localhost:8080/api/dataschema/${encodeURIComponent(dataschemaId)}`;

  console.log(`Submitting Update Payload to ${apiUrl}:`, JSON.stringify(payload));

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

  } catch (networkError: any) {
      console.error(`Network error updating dataschema (ID: ${dataschemaId}):`, networkError);
      throw new Error(`Network error: ${networkError.message || 'Failed to connect to the server.'}`);
  }

  if (!response.ok) {
    let errorData: any = { message: `API Error: ${response.status} ${response.statusText}` };
    try {
      const responseBody = await response.text();
      if (responseBody) {
          errorData = JSON.parse(responseBody);
      }
      console.error(`API Update Error Response from ${apiUrl}:`, response.status, errorData);
    } catch (parseError) {
      console.error(`Failed to parse error response body from ${apiUrl}. Status: ${response.status}`);
    }

    throw new Error(errorData?.message || `Failed to update data schema (ID: ${dataschemaId}). Status: ${response.status}`);
  }

  console.log(`Dataschema (ID: ${dataschemaId}) updated successfully via service!`);
};