import React, { useEffect, useState } from 'react';
import styles from '../styles/datasetdistribution-download.module.css';
import { Card, Container, Table, Form, Dropdown } from 'react-bootstrap';
import { BackButtonComponent } from '../../../components/back-button/back-button-component';
import { DatasetDistribution } from '../types/datasetdistribution';
import { Availability } from '../types/availability';

const DatasetDistributionDownload: React.FC = () => {
  const [datasetDistributions, setDatasetDistributions] = useState<DatasetDistribution[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const datasetDistributions: DatasetDistribution[] = [
        {
          id: '1',
          title: 'Distribution 1',
          url: 'https://example.com/distribution1',
          availability: Availability.VERY_HIGH,
          format: 'CSV',
          description: ''
        },
        {
          id: '2',
          title: 'Distribution 2',
          url: 'https://example.com/distribution2',
          availability: Availability.LOW,
          format: 'JSON',
          description: ''
        },
        {
          id: '3',
          title: 'Distribution 3',
          url: 'https://example.com/distribution3',
          availability: Availability.VERY_HIGH,
          format: 'CSV',
          description: ''
        }
      ]
      setDatasetDistributions(datasetDistributions);
    };
    // const datasetDistributions = await fetchDatasetDistributions();
    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backBtn}>
        <BackButtonComponent to='/' />
      </div>
      <div className={styles.title}>
        Download Distributions for Dataset #1
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