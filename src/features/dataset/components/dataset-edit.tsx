import React, { FC, useEffect, useState } from 'react';
import { Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from '../styles/dataset-edit.module.css';
import {Link, useLocation, useNavigate, useParams} from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { getDataset } from '../api/dataset-fetch';
import { editDataset } from '../api/dataset-edit';
import { Dataset } from '../types/dataset';
import { VCard } from '../types/v-card';
import { LanguageSpecificDatasetInfo } from '../types/language-specific-dataset-info';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { Availability } from '../../datasetdistribution/types/availability';

const DatasetEdit: FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();

  const location = useLocation();
  const { parentCatalog } = location.state || {};

  const [theme, setTheme] = useState('');
  const [uri, setUri] = useState('');
  const [languageSpecificDatasetInfo, setLanguageSpecificDatasetInfo] = useState<LanguageSpecificDatasetInfo[]>([]);
  const [schemaId, setSchemaId] = useState('');
  const [vCard, setVCard] = useState<VCard>();
  const selectedLanguagesSet = new Set(languageSpecificDatasetInfo.map(desc => desc.langCode));

  const languageList = ['EN', 'DE', 'FR', 'IT', 'ES', 'PT', 'PL'];

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadDatasetData = async () => {
      if (!datasetId) return;

      try {
        const data = await getDataset(datasetId);
        setTheme(data.theme || '');
        setUri(data.uri || '');
        setVCard(data.vCard ? {
          authorNames: Array.isArray(data.vCard.authorNames) ? data.vCard.authorNames : [],
          relatedWebsites: Array.isArray(data.vCard.relatedWebsites) ? data.vCard.relatedWebsites.filter(Boolean) : [],
          orgs: Array.isArray(data.vCard.orgs) ? data.vCard.orgs.filter(Boolean) : [],
          contactEmails: Array.isArray(data.vCard.contactEmails) ? data.vCard.contactEmails.filter(Boolean) : [],
        } : {
          authorNames: [],
          relatedWebsites: [],
          orgs: [],
          contactEmails: [],
        });
        setSchemaId(data.schemaId || '');

        const descriptions = data.languageSpecificDatasetInfo || [];
        setLanguageSpecificDatasetInfo(
          descriptions.map((desc) => ({
            ...desc,
            id: uuidv4(),
          }))
        );
      } catch (error: any) {
        console.error('Error loading dataset:', error);
        toast.error('Failed to load dataset data.');
      }
    };

    loadDatasetData();
  }, [datasetId]);

  const handleAddDescription = () => {
    const selectedLanguages = new Set(languageSpecificDatasetInfo.map(desc => desc.langCode));
    const nextAvailableLanguage = languageList.find(lang => !selectedLanguages.has(lang));

    if (nextAvailableLanguage) {
      setLanguageSpecificDatasetInfo([
        ...languageSpecificDatasetInfo,
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

  const handleRemoveDescription = (idToRemove: string | undefined) => {
    if (languageSpecificDatasetInfo.length <= 1) {
      alert('At least one language description is required.');
      return;
    }
    setLanguageSpecificDatasetInfo(languageSpecificDatasetInfo.filter(desc => desc.id !== idToRemove));
  };

  const handleDescriptionChange = (
    idToUpdate: string | undefined,
    field: keyof LanguageSpecificDatasetInfo,
    value: string | string[]
  ) => {
    setLanguageSpecificDatasetInfo(prev =>
      prev.map(desc =>
        desc.id === idToUpdate ? { ...desc, [field]: value } : desc
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const languageSpecificDatasetInfoPayload = languageSpecificDatasetInfo.map(({ id, ...obj }) => obj)

    const payload: Dataset = {
      theme,
      uri,
      languageSpecificDatasetInfo: languageSpecificDatasetInfoPayload,
      schemaId,
      vCard,
      parentCatalog: parentCatalog !== "root" ? parentCatalog : undefined,
    };

    editDataset(datasetId!, payload).then(() => {
      toast.success('Dataset updated successfully!');
    }).catch((err) => {
      console.error(err);
      toast.error('Network error while saving.');
    }).finally(() => {
      setIsSaving(false);
    });

  }
  return (
    <div className={styles.container}>
      <div>
        <BackButtonComponent to='/dataset-catalog' />
      </div>

      <div className={styles.header}>Edit dataset definition</div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <label className={styles.inputGroupLabel}>General dataset information:</label>

          <InputGroup className={styles.inputGroup}>
            <InputGroup.Text className={styles.inputLabel}>Dataset Identifier</InputGroup.Text>
            <Form.Control value={datasetId} readOnly className={styles.inputValue} />
          </InputGroup>

          <InputGroup className={styles.inputGroup}>
            <InputGroup.Text className={styles.inputLabel}>Dataset Theme</InputGroup.Text>
            <Form.Control
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className={styles.inputValue}
              required
            />
          </InputGroup>

          <InputGroup className={styles.inputGroup}>
            <InputGroup.Text className={styles.inputLabel}>Dataset URI</InputGroup.Text>
            <Form.Control
              type="url"
              value={uri}
              onChange={e => setUri(e.target.value)}
              className={styles.inputValue}
            />
          </InputGroup>
        </div>

        <div className={styles.section}>
          <label className={styles.inputGroupLabel}>Author VCard (comma-separated):</label>

          {[
            ['Author names', 'authorNames'],
            ['Websites', 'relatedWebsites'],
            ['Organizations', 'orgs'],
            ['Contact emails', 'contactEmails'],
          ].map(([label, key]) => (
            <InputGroup key={key} className={styles.inputGroup}>
              <InputGroup.Text className={styles.inputLabel}>{label}</InputGroup.Text>
              <Form.Control
                value={vCard?.[key as keyof VCard]?.join(', ') || ''}
                onChange={e =>
                  setVCard({
                    ...vCard,
                    [key]: e.target.value.split(',').map(str => str.trim()) || []
                  } as VCard)
                }
                className={styles.inputValue}
              />
            </InputGroup>
          ))}
        </div>

        {languageSpecificDatasetInfo.map((desc, index) => {
          const availableLanguages = languageList.filter(
            lang => !selectedLanguagesSet.has(lang) || lang === desc.langCode
          );

          return (
            <div key={desc.id} className={styles.section}>
              <label className={styles.inputGroupLabel}>
                Language Description #{index + 1}
              </label>

              <InputGroup className={styles.inputGroup}>
                <InputGroup.Text className={styles.inputLabel}>Title</InputGroup.Text>
                <Form.Control
                  value={desc.title}
                  onChange={e => handleDescriptionChange(desc.id, 'title', e.target.value)}
                  className={styles.inputValue}
                  required
                />
              </InputGroup>

              <InputGroup className={styles.inputGroup}>
                <InputGroup.Text className={styles.inputLabel}>Keywords</InputGroup.Text>
                <Form.Control
                  value={desc.keyword}
                  onChange={e => handleDescriptionChange(desc.id, 'keyword', e.target.value.split(',').map(keyword => keyword.trim()))}
                  className={styles.inputValue}
                />
              </InputGroup>

              <InputGroup className={styles.inputGroup}>
                <InputGroup.Text className={styles.inputLabel}>Language</InputGroup.Text>
                <Form.Select
                  value={desc.langCode ?? ''}
                  onChange={e => handleDescriptionChange(desc.id, 'langCode', e.target.value)}
                  className={styles.inputValue}
                >
                  {availableLanguages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>

              <Form.Control
                as="textarea"
                rows={3}
                value={desc.description}
                onChange={e => handleDescriptionChange(desc.id, 'description', e.target.value)}
                className={`${styles.formTextArea} mx-auto`}
                placeholder="Dataset description"
                required
              />

              {languageSpecificDatasetInfo.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveDescription(desc.id)}
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
            disabled={languageSpecificDatasetInfo.length >= languageList.length}
            className={styles.button}
          >
            + Add Language
          </Button>

          <Button
            type="submit"
            variant="success"
            disabled={isSaving}
            className={`${styles.button} mt-3`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DatasetEdit;
