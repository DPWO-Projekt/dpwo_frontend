import React, { FC, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import styles from '../styles/datasetdistribution-add.module.css';
import { Link, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { Trash, Send } from 'react-bootstrap-icons'
import { toast } from 'react-toastify';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { Availability } from '../types/availability';

export interface Property {
  type: string;
  name: string;
}

export interface InitialDatasetData {
  name: string;
  properties: []
}

interface DataSchemaAddProps {
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
}

const DatasetDistributionAdd: FC<DataSchemaAddProps> = ({
  onSaveSuccess,
  onSaveError,
}) => {
  const availableDataTypes = ["text", "decimal", "boolean", "date", "link"]
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [datasetName, setdatasetName] = useState('');
  const [schemaProperties, setSchemaProperties] = useState([
    {
      type: availableDataTypes[0],
      name: '',
      id: uuidv4()
    }
  ]);

  const formats = ["JSON", "CSV"];
  const availabilities = ["VERY_HIGH", "HIGH", "MEDIUM", "LOW", "VERY_LOW"];
  
  const handleAddProperty = () => {
    setSchemaProperties([
      ...schemaProperties,
      {
        type: availableDataTypes[0],
        name: '',
        id: uuidv4()
      },
    ]);
    console.log(schemaProperties);
  };

  const handleRemoveProperty = (idToRemove: string) => {
    if (schemaProperties.length <= 1) {
      alert('You must have at least one property.');
      return;
    }
    setSchemaProperties(schemaProperties.filter((prop) => prop.id !== idToRemove));
  };

  type DescriptionField = keyof (Property & { id: string });
  const handlePropChange = (idToUpdate: string, field: DescriptionField, value: string) => {
    setSchemaProperties(
      schemaProperties.map((prop) => {
        if (prop.id === idToUpdate) {
          return { ...prop, [field]: value };
        }
        return prop;
      })
    );
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    var propMap: any = {};
    schemaProperties.forEach(prop => {
      propMap[prop.name] = prop.type;
    });
    const payload = {
      name: datasetName,
      properties: propMap
    };
    console.log('Submitting Payload for Add:', JSON.stringify(payload));

    try {
      const response = await fetch(`http://localhost:8080/api/dataschema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Dataset updated successfully!');
        onSaveSuccess?.();
        toast('Dataschema added successfully!');
        navigate("/dataschema-catalog");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Failed Response:', response.status, errorData);
        onSaveError?.(errorData);
        toast('Unexpected error.');
      }
    } catch (error) {
      console.error('Network or other error:', error);
      onSaveError?.(error);
      toast('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <BackButtonComponent to='/dataschema-catalog' />
      </div>

      <div className={styles.header}>Attach distribution to dataset</div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Access URL</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetName}
              onChange={(e) => setdatasetName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Availability</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Theme"
              aria-label="Theme"
              as="select"
              value={datasetName}
              onChange={(e) => setdatasetName(e.target.value)}
              required
            >
            {availabilities.map((av) => (
              <option key={av} value={av}>{av}</option>
            ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Format</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetName}
              as="select"
              onChange={(e) => setdatasetName(e.target.value)}
              required
            >
            {formats.map((format) => (
              <option key={format} value={format}>{format}</option>
            ))}
          </Form.Control>
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Distribution title</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetName}
              onChange={(e) => setdatasetName(e.target.value)}
              required
            />
          </InputGroup>
          <Form.Control
            as="textarea"
            rows={3}
            className={`${styles.formTextArea} mx-auto`}
            placeholder="Dataset description."
            aria-label="Dataset description."
            required
          />
        </div>

        <div className={styles.section}>
            <Button
            className={`${styles.button} mt-3`}
            variant="success"
            type="submit"
            disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Add'}
              <Send />
            </Button>
        </div>
      </Form>
    </div>
  );
};

export default DatasetDistributionAdd;