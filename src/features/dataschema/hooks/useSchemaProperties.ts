import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { Property } from '../types/property';

export interface SchemaPropertyItem extends Property {
  id: string;
}

interface UseSchemaPropertiesReturn {
  schemaProperties: SchemaPropertyItem[];
  addProperty: () => void;
  removeProperty: (idToRemove: string) => void;
  handlePropChange: (idToUpdate: string, field: keyof SchemaPropertyItem, value: string) => void;
  setSchemaProperties: React.Dispatch<React.SetStateAction<SchemaPropertyItem[]>>;
}

const availableDataTypes = ["text", "decimal", "boolean", "date", "link"];

export const useSchemaProperties = (initialProperties?: SchemaPropertyItem[]): UseSchemaPropertiesReturn => {
  const defaultInitialState: SchemaPropertyItem[] = initialProperties || [
    {
      type: availableDataTypes[0],
      name: '',
      id: uuidv4(),
    },
  ];

  const [schemaProperties, setSchemaProperties] = useState<SchemaPropertyItem[]>(defaultInitialState);

  const addProperty = () => {
    setSchemaProperties(prevProperties => [
      ...prevProperties,
      {
        type: availableDataTypes[0],
        name: '',
        id: uuidv4(),
      },
    ]);
  };

  const removeProperty = (idToRemove: string) => {
    if (schemaProperties.length <= 1) {
      toast.warn('You must have at least one property.');
      return;
    }
    setSchemaProperties(prevProperties =>
      prevProperties.filter((prop) => prop.id !== idToRemove)
    );
  };

  const handlePropChange = (idToUpdate: string, field: keyof SchemaPropertyItem, value: string) => {
    setSchemaProperties(prevProperties =>
      prevProperties.map((prop) => {
        if (prop.id === idToUpdate) {
          return { ...prop, [field]: value };
        }
        return prop;
      })
    );
  };

  return {
    schemaProperties,
    addProperty,
    removeProperty,
    handlePropChange,
    setSchemaProperties
  };
};