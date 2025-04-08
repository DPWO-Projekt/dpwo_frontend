import React, { FC, useState, useEffect } from 'react';
import { Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from './DataSchemaAdd.module.css';
import {Link, useLocation} from 'react-router';

export interface Property {
  type: string;
  name: string;
}

export interface InitialDatasetData {
  title: string;
  properties: [Property]
}

interface DataSchemaAddProps {
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
}

const DataSchemaAdd: FC<DataSchemaAddProps> = ({
  onSaveSuccess,
  onSaveError,
}) => {

  const [isSaving, setIsSaving] = useState(false);

  const [datasetTitle, setdatasetTitle] = useState('');
  const [schemaProperties, setSchemaProperties] = useState([
    {
      type: '',
      name: ''
    }
  ]);

  const handleAddDescription = () => {
    setSchemaProperties([
      ...schemaProperties,
      {
        type: '',
        name: ''
      },
    ]);
  };

  const handleRemoveDescription = (idToRemove: string) => {
    if (schemaProperties.length <= 1) {
      alert('You must have at least one language description.');
      return;
    }
    setSchemaProperties(schemaProperties.filter((prop) => prop.name !== idToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title: datasetTitle,
    };

    console.log('Submitting Payload for Edit:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`http://localhost:8080/api/dataset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Dataset updated successfully!');
        onSaveSuccess?.();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Failed Response:', response.status, errorData);
        onSaveError?.(errorData);
      }
    } catch (error) {
      console.error('Network or other error:', error);
      onSaveError?.(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Link to={'/'}>Home</Link>
        <CloseButton />
      </div>

      <div className={styles.header}>Add data schema</div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetTitle}
              onChange={(e) => setdatasetTitle(e.target.value)}
              required
            />
          </InputGroup>
        </div>

        {schemaProperties.map((descData, index) => {
          return (
            <div key={descData.name} className={styles.section}>
              <label className={styles.inputGroupLabel}>
                Language specific dataset description #{index + 1}:
              </label>

              <InputGroup className={`${styles.inputGroup} mx-auto`}>
                <InputGroup.Text className={`${styles.inputLabel}`}>Property type</InputGroup.Text>
                <Form.Control
                  className={`${styles.inputValue}`}
                  placeholder="string"
                  aria-label="Property type"
                  value={descData.type}
                  required
                />
              </InputGroup>
              <InputGroup className={`${styles.inputGroup} mx-auto`}>
                <InputGroup.Text className={`${styles.inputLabel}`}>Keywords</InputGroup.Text>
                <Form.Control
                  className={`${styles.inputValue}`}
                  placeholder="Property name"
                  aria-label="Property type"
                  value={descData.name}
                  //onChange={(e) => handleDescriptionChange(descData.id, 'keywords', e.target.value)}
                />
              </InputGroup>
              {schemaProperties.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveDescription(descData.name)}
                  className={styles.button}
                >
                  Remove
                </Button>
              )}
            </div>
          );
        })}

        <div className={styles.buttonContainer}>
          <Button
            variant="secondary"
            onClick={handleAddDescription}
            className={styles.button}
            disabled={isSaving}
          >
            + Additional property
          </Button>

          <Button
            className={`${styles.button} mt-3`}
            variant="success"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DataSchemaAdd;