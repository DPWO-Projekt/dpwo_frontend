import React, { FC, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import styles from './DataSchemaAdd.module.css';
import { Link, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { Trash, Send } from 'react-bootstrap-icons'
import { toast } from 'react-toastify';

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

const DataSchemaAdd: FC<DataSchemaAddProps> = ({
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
        navigate("/catalog");
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
      <div className={styles.nav}>
        <Link to={'/'}>Home</Link>
      </div>

      <div className={styles.header}>Add data schema</div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <Form.Control
              className={`${styles.inputValueFull}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetName}
              onChange={(e) => setdatasetName(e.target.value)}
              required
            />
          </InputGroup>
        </div>

        {schemaProperties.map((propData, index) => {
          return (
            <div key={propData.id} className={styles.section}>
              <InputGroup className={`${styles.inputGroup} mx-auto`}>
                <Form.Control
                  as="select"
                  value={propData.type}
                  className={`${styles.inputLabel}`}
                  onChange={(e) => handlePropChange(propData.id, 'type', e.target.value)}
                >
                  {availableDataTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Form.Control>
                <Form.Control
                  className={`${styles.inputValue}`}
                  placeholder="Property name"
                  aria-label="Property name"
                  value={propData.name}
                  onChange={(e) => handlePropChange(propData.id, 'name', e.target.value)}
                  required
                />
              </InputGroup>
              <div className={styles.trashIconContainer}>
                <Trash
                  className={`${styles.trashIcon} ${index === 0 ? styles.hiddenTrashIcon : ''}`}
                  onClick={() => handleRemoveProperty(propData.id)}
                />
              </div>
            </div>
          );
        })}
        <div className={styles.section}>
          <Button
            variant="outline-secondary"
            onClick={handleAddProperty}
            className={`${styles.addPropButton}`}
            disabled={isSaving}
          >
            Add property
          </Button>
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

export default DataSchemaAdd;