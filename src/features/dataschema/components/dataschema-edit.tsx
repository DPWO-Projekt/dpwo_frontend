import React, { FC, useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import styles from '../styles/dataschema-edit.module.css';
import { Link, useNavigate, useParams } from 'react-router';
import { Trash, Send } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import { editDataSchema } from '../api/dataschema-edit';

import { useSchemaProperties, SchemaPropertyItem } from '../hooks/useSchemaProperties';
import { fetchDataSchema } from '../api/dataschema-fetch';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';

interface DataSchemaEditProps { }

const DataSchemaEdit: FC<DataSchemaEditProps> = () => {
  const { schemaId } = useParams<{ schemaId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [datasetName, setDatasetName] = useState<string>('');

  const {
    schemaProperties,
    addProperty: handleAddProperty,
    removeProperty: handleRemoveProperty,
    handlePropChange,
    setSchemaProperties
  } = useSchemaProperties([]);

  const availableDataTypes = ["text", "decimal", "boolean", "date", "link"];

  useEffect(() => {
    const loadSchemaData = async () => {
      setIsLoading(true);
      setFetchError(null);
      console.log(`Fetching data for schema ID: ${schemaId}`);
      try {
        if (!schemaId) {
          throw new Error("Schema ID is undefined.");
        }
        const data = await fetchDataSchema(schemaId);

        setDatasetName(data.name);

        const propertiesArray: SchemaPropertyItem[] = Object.entries(data.properties)
          .filter(([name, type]) => name && type)
          .map(([name, type]) => ({
            name: name,
            type: String(type),
            id: crypto.randomUUID()
          }));

        if (propertiesArray.length === 0) {
          console.log("Fetched schema has no properties, adding a default row.");
          setSchemaProperties([{ type: availableDataTypes[0], name: '', id: crypto.randomUUID() }]);
        } else {
          setSchemaProperties(propertiesArray);
        }

      } catch (error: any) {
        console.error('Failed to fetch dataschema:', error);
        toast.error(`Error loading schema: ${error?.message || 'Unknown error'}`);
        setFetchError(error?.message || 'Failed to load schema data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchemaData();

  }, [schemaId, setSchemaProperties]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schemaId) {
      toast.error("Cannot save: Schema ID is missing.");
      console.error("handleSubmit error: schemaId is missing.");
      return;
    }

    if (!datasetName.trim()) {
      toast.error('Theme name cannot be empty.');
      return;
    }
    const validProperties = schemaProperties.filter(p => p.name.trim());
    if (validProperties.length === 0) {
      toast.error('Schema must have at least one property with a valid name.');
      return;
    }
    if (validProperties.some(p => !p.name.trim())) {
      toast.error('All property names must be filled.');
      return;
    }
    const names = validProperties.map(p => p.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      toast.error('Property names must be unique.');
      return;
    }

    setIsSaving(true);

    try {
      await editDataSchema(
        schemaId,
        datasetName,
        validProperties
      );

      toast.success('Dataschema updated successfully!');
      navigate("/dataschema-catalog");

    } catch (error: any) {
      console.error('Failed to update dataschema:', error);
      toast.error(`Error saving: ${error?.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}><p>Loading schema data...</p></div>;
  }

  if (fetchError) {
    return <div className={styles.container}><p style={{ color: 'red' }}>Error: {fetchError}</p><Link to="/dataschema-catalog">Go back</Link></div>;
  }

  return (
    <div className={styles.container}>
      <div>
        <BackButtonComponent to='/dataschema-catalog' />
      </div>

      <div className={styles.header}>Edit data schema</div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <Form.Control
              className={`${styles.inputValueFull}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              required
              disabled={isSaving}
            />
          </InputGroup>
        </div>

        {schemaProperties.map((propData, index) => (
          <div key={propData.id} className={styles.section}>
            <InputGroup className={`${styles.inputGroup} mx-auto`}>
              <Form.Control
                as="select"
                value={propData.type}
                className={`${styles.inputLabel}`}
                onChange={(e) => handlePropChange(propData.id, 'type', e.target.value)}
                aria-label={`Data type for property ${index + 1}`}
                disabled={isSaving}
              >
                {availableDataTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Form.Control>
              <Form.Control
                className={`${styles.inputValue}`}
                placeholder="Property name"
                aria-label={`Property name ${index + 1}`}
                value={propData.name}
                onChange={(e) => handlePropChange(propData.id, 'name', e.target.value)}
                required
                disabled={isSaving}
              />
            </InputGroup>
            <div className={styles.trashIconContainer}>
              {schemaProperties.length > 1 && (
                <Trash
                  className={`${styles.trashIcon} ${isSaving ? styles.disabledIcon : ''}`}
                  onClick={() => !isSaving && handleRemoveProperty(propData.id)}
                  aria-label={`Remove property ${index + 1}`}
                  role="button"
                />
              )}
            </div>
          </div>
        ))}

        <div className={styles.section}>
          <Button
            variant="outline-secondary"
            onClick={handleAddProperty}
            className={`${styles.addPropButton}`}
            disabled={isSaving}
            type="button"
          >
            Add property
          </Button>
        </div>

        <div className={styles.section}>
          <Button
            className={`${styles.button} mt-3`}
            variant="success"
            type="submit"
            disabled={isSaving || isLoading}
          >
            {isSaving ? 'Saving...' : 'Update Schema'}
            <Send className="ms-2" />
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DataSchemaEdit;