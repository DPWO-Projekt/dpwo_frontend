import React, { FC, useState, useEffect } from 'react';
import { Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from './DatasetEdit.module.css';
import {Link, useLocation} from 'react-router';
import { v4 as uuidv4 } from 'uuid';


export interface InitialDatasetData {
  title: string;
  properties: Map<string, string>
}

interface DataSchemaAddProps {
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
}

const DataSchemaAdd: FC<DataSchemaAddProps> = ({
  onSaveSuccess,
  onSaveError,
}) => {

  const [datasetTitle, setdatasetTitle] = useState(init?.title ?? '');

  const [languageDescriptions, setLanguageDescriptions] = useState(new Map<string, string>);

  const [isSaving, setIsSaving] = useState(false);

  const handleAddDescription = () => {
    const selectedLanguages = new Set(languageDescriptions.map(desc => desc.language));
    const nextAvailableLanguage = languageList.find(lang => !selectedLanguages.has(lang));

    if (nextAvailableLanguage) {
      setLanguageDescriptions([
        ...languageDescriptions,
        {
          id: uuidv4(),
          title: '',
          keywords: '',
          language: nextAvailableLanguage,
          description: '',
        },
      ]);
    } else {
      alert("All available languages have been added.");
    }
  };

  const handleRemoveDescription = (idToRemove: string) => {
    if (languageDescriptions.length <= 1) {
      alert('You must have at least one language description.');
      return;
    }
    setLanguageDescriptions(languageDescriptions.filter((desc) => desc.id !== idToRemove));
  };

  type DescriptionField = keyof (InitialLanguageDescription & { id: string });
  const handleDescriptionChange = (idToUpdate: string, field: DescriptionField, value: string) => {
    setLanguageDescriptions(
      languageDescriptions.map((desc) => {
        if (desc.id === idToUpdate) {
          return { ...desc, [field]: value };
        }
        return desc;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title: title,
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
              value={title}
              onChange={(e) => setDatasetTheme(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Dataset URI</InputGroup.Text>
            <Form.Control
              type="url"
              className={`${styles.inputValue}`}
              placeholder="Dataset URI (optional)"
              aria-label="Dataset URI"
              value={datasetUri}
              onChange={(e) => setDatasetUri(e.target.value)}
            />
          </InputGroup>
        </div>

        {languageDescriptions.map((descData, index) => {
          const availableLanguages = languageList.filter(lang =>
            !selectedLanguagesSet.has(lang) || lang === descData.language
          );

          return (
            <div key={descData.id} className={styles.section}>
              <label className={styles.inputGroupLabel}>
                Language specific dataset description #{index + 1}:
              </label>

              <InputGroup className={`${styles.inputGroup} mx-auto`}>
                <InputGroup.Text className={`${styles.inputLabel}`}>Dataset Title</InputGroup.Text>
                <Form.Control
                  className={`${styles.inputValue}`}
                  placeholder="Dataset Title"
                  aria-label="Dataset Title"
                  value={descData.title}
                  onChange={(e) => handleDescriptionChange(descData.id, 'title', e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup className={`${styles.inputGroup} mx-auto`}>
                <InputGroup.Text className={`${styles.inputLabel}`}>Keywords</InputGroup.Text>
                <Form.Control
                  className={`${styles.inputValue}`}
                  placeholder="Keywords (comma separated)"
                  aria-label="Keywords"
                  value={descData.keywords}
                  onChange={(e) => handleDescriptionChange(descData.id, 'keywords', e.target.value)}
                />
              </InputGroup>
              {languageDescriptions.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveDescription(descData.id)}
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
            disabled={languageDescriptions.length >= languageList.length || isSaving}
          >
            + Additional language
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