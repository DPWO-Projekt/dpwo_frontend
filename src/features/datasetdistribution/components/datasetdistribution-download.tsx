import React, { useEffect, useState } from 'react';
import styles from '../styles/datasetdistribution-download.module.css';
import { Card, Container, Table, Form, Dropdown } from 'react-bootstrap';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { DatasetDistribution } from '../types/datasetdistribution';
import { Availability } from '../types/availability';
import { getDataset } from '../../dataset/api/dataset-fetch';
import { useParams } from 'react-router-dom';

const DatasetDistributionDownload: React.FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();
  const [datasetDistributions, setDatasetDistributions] = useState<DatasetDistribution[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!datasetId) return;
      const dataset = await getDataset(datasetId);
      setDatasetDistributions(dataset.datasetDistributions || []);
    };
    loadData();
  }, [datasetId]);

  return (
    <div className={styles.container}>
      <div className={styles.backBtn}>
        <BackButtonComponent to='/dataset-catalog' />
      </div>
      <div className={styles.title}>
        Download Distributions for Dataset #{datasetId}
      </div>
      <Container fluid className="d-flex justify-content-center pt-5">
        <Card className="col-8" style={{ borderRadius: '10px' }}>
          <Table hover className={styles.table}>
            <thead>
              <tr>
                <th>
                  <Form.Check type="checkbox" />
                </th>
                <th>Distribution Title</th>
                <th>Access URL</th>
                <th>Availability</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {/* Datasets */}
              {datasetDistributions && datasetDistributions.length > 0 ? (
                datasetDistributions.map((distribution) => (<tr key={distribution.id}>
                  <td>
                    <Form.Check type="checkbox" />
                  </td>
                  <td>{distribution.title}</td>
                  <td>{distribution.url}</td>
                  <td>{distribution.availability}</td>
                  <td>{distribution.format}</td>
                  <td>
                    <button className={styles.attachButton}>Download</button>
                  </td>
                </tr>))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    {datasetDistributions === null ? 'Loading distributions...' : 'No distributions found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </div>
  );
};

export default DatasetDistributionDownload; 