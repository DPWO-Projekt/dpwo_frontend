import React, { FC, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import styles from '../styles/datasetdistribution-add.module.css';
import { Link, useNavigate, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { Trash, Send } from 'react-bootstrap-icons'
import { toast } from 'react-toastify';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { Availability } from '../types/availability';
import { addDatasetDistribution } from '../api/datasetdistribution-add';

interface DatasetDistributionAddProps {
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
}

const DatasetDistributionAdd: FC<DatasetDistributionAddProps> = ({
  onSaveSuccess,
  onSaveError,
}) => {
  const formats = ["JSON", "CSV"];
  const availabilities = ["VERY_HIGH", "HIGH", "MEDIUM", "LOW", "VERY_LOW"];
  const { datasetId } = useParams<{ datasetId: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [availability, setAvailability] = useState(availabilities[0]);
  const [format, setFormat] = useState(formats[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      url: url,
      availability: availability,
      format: format,
      title: title,
      description: description
    }
    console.log('Submitting Payload for Add:', JSON.stringify(payload));

    try {
      await addDatasetDistribution(datasetId!, payload);
      toast("Distribution added!");
      navigate("/dataset-owned")
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
        <BackButtonComponent to='/dataset-owned'/>
      </div>

      <div className={styles.header}>Attach distribution to dataset</div>
      <div className={styles.subheader}>Dataset: {datasetId}</div>
      <Form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Access URL</InputGroup.Text>
            <Form.Control
              type="url"
              className={`${styles.inputValue}`}
              placeholder="URL"
              aria-label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className={`${styles.inputGroup} mx-auto`}>
            <InputGroup.Text className={`${styles.inputLabel}`}>Availability</InputGroup.Text>
            <Form.Control
              className={`${styles.inputValue}`}
              placeholder="Availability"
              aria-label="Availability"
              as="select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
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
              placeholder="Format"
              aria-label="Format"
              value={format}
              as="select"
              onChange={(e) => setFormat(e.target.value)}
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
              placeholder="Title"
              aria-label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </InputGroup>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${styles.formTextArea} mx-auto`}
            placeholder="Distribution description."
            aria-label="Distribution description."
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