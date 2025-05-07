import React, { FC, useState } from 'react';
import { Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from '../styles/dataset-add.module.css';
import { Link, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';

interface InitialLanguageDescription {
  title: string;
  keyword: string[];
  langCode: string;
  description: string;
}

interface InitialAuthorData {
  names: string;
  websites: string;
  organizations: string;
  emails: string;
}

export interface InitialDatasetData {
  schemaId: string;
  theme: string;
  uri?: string;
  authors?: InitialAuthorData;
  descriptions?: InitialLanguageDescription[];
}

interface DatasetEditProps {
  initialData?: InitialDatasetData;
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
}

const DatasetAdd: FC<DatasetEditProps> = ({
  onSaveSuccess,
  onSaveError,
}) => {

  const [schemaId, setSchemaId] = useState('');
  const [datasetTheme, setDatasetTheme] = useState('');
  const [datasetUri, setDatasetUri] = useState('');
  const navigate = useNavigate();

  const [vCard, setVCard] = useState({
    authorNames: [''],
    relatedWebsites: [''],
    orgs: [''],
    contactEmails: [''],
  });

  const languageList = ['EN', 'DE', 'FR', 'IT', 'ES', 'PT'];

  const [languageDescriptions, setLanguageDescriptions] = useState(
    [
      {
        id: uuidv4(),
        title: '',
        keyword: ['string'],
        langCode: languageList[0] || '',
        description: '',
      },
    ]
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleAddDescription = () => {
    const selectedLanguages = new Set(languageDescriptions.map(desc => desc.langCode));
    const nextAvailableLanguage = languageList.find(lang => !selectedLanguages.has(lang));

    if (nextAvailableLanguage) {
      setLanguageDescriptions([
        ...languageDescriptions,
        {
          id: uuidv4(),
          title: '',
          keyword: [],
          langCode: nextAvailableLanguage,
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
  const handleDescriptionChange = (idToUpdate: string, field: DescriptionField, value: string | string[]) => {
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
      uri: datasetUri,
      schemaId: "schemaId",
      theme: datasetTheme,
      languageSpecificDatasetInfo: languageDescriptions.map(({ id, ...rest }) => rest),
      vCard: vCard
    };

    console.log('Submitting Payload for Adding:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`/api/datasetdefinition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast('Dataset added successfully!');
        onSaveSuccess?.();
        navigate("/dataset-catalog");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Failed Response:', response.status, errorData);
        onSaveError?.(errorData);
        toast('Unexpected Error!');
      }
    } catch (error) {
      console.error('Network or other error:', error);
      onSaveError?.(error);
      toast('Network error!');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedLanguagesSet = new Set(languageDescriptions.map(desc => desc.langCode));

  return (
    <div className={styles.container}>
      <div>
        <BackButtonComponent to='/dataset-catalog' />
      </div>

      <div className={styles.header}>Add dataset definition</div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <label className={styles.inputGroupLabel}>General dataset information:</label>

          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Dataset Theme</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Theme"
              aria-label="Theme"
              value={datasetTheme}
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

        <div className={styles.section}>
          <label className={styles.inputGroupLabel}>Author VCard information (comma separated for multiple values):</label>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Author names</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Author Names"
              aria-label="Author names"
              value={vCard.authorNames}
              onChange={(e) => setVCard({ ...vCard, authorNames: e.target.value.split(',') })}
            />
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Websites</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Websites"
              aria-label="Websites"
              value={vCard.relatedWebsites}
              onChange={(e) => setVCard({ ...vCard, relatedWebsites: e.target.value.split(',') })}
            />
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Organizations</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Organizations"
              aria-label="Organizations"
              value={vCard.orgs}
              onChange={(e) => setVCard({ ...vCard, orgs: e.target.value.split(',') })}
            />
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Contact e-mails</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="E-mails"
              aria-label="E-mails"
              value={vCard.contactEmails}
              onChange={(e) => setVCard({ ...vCard, contactEmails: e.target.value.split(',') })}
            />
          </InputGroup>
        </div>

        {languageDescriptions.map((descData, index) => {
          const availableLanguages = languageList.filter(lang =>
            !selectedLanguagesSet.has(lang) || lang === descData.langCode
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
                  value={descData.keyword}
                  onChange={(e) => handleDescriptionChange(descData.id, 'keyword', e.target.value.split(',').map(keyword => keyword.trim()))}
                />
              </InputGroup>
              <InputGroup className={`${styles.inputGroup} mx-auto`}>
                <InputGroup.Text className={`${styles.inputLabel}`}>Language</InputGroup.Text>
                <Form.Control
                  as="select"
                  value={descData.langCode}
                  className={`${styles.inputValue}`}
                  onChange={(e) => handleDescriptionChange(descData.id, 'langCode', e.target.value)}
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Form.Control>
              </InputGroup>
              <Form.Control
                as="textarea"
                rows={3}
                className={`${styles.formTextArea} mx-auto`}
                placeholder="Dataset description."
                aria-label="Dataset description."
                value={descData.description}
                onChange={(e) => handleDescriptionChange(descData.id, 'description', e.target.value)}
                required
              />
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
            {isSaving ? 'Saving...' : 'Save new dataset'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DatasetAdd;