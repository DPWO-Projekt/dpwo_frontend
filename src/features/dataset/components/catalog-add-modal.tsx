import React, { FC, useState, useRef } from 'react';
import { Modal, Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from '../styles/dataset-edit.module.css';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { CatalogService } from '../api/dataset-catalog-service';
import { Catalog } from '../types/catalog';
import { v4 as uuidv4 } from 'uuid';

interface CatalogAddModalProps {
    show: boolean;
    onHide: () => void;
    catalogService: CatalogService;
}

const CatalogAddModal: FC<CatalogAddModalProps> = ({ show, onHide, catalogService }) => {
    const navigate = useNavigate();
    const [catalogName, setCatalogName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const serviceRef = useRef(catalogService);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setNameError(null);

        const currentCatalog = serviceRef.current.getCurrentCatalog();
        if (!currentCatalog) {
            setNameError('No current catalog available!');
            setIsSaving(false);
            return;
        }

        const isUnique = !currentCatalog.catalogs?.some(c => c.title.toLowerCase() === catalogName.toLowerCase());
        if (!isUnique) {
            setNameError('Catalog name has to be unique!');
            setIsSaving(false);
            return;
        }

        const newCatalog: Catalog = {
            id: parseInt(uuidv4().replace(/\D/g, '').slice(0, 8)),
            title: catalogName,
            description: '',
            datasets: [],
            catalogs: [],
        };

        currentCatalog.catalogs = currentCatalog.catalogs || [];
        currentCatalog.catalogs.push(newCatalog);
        setCatalogName('');
        setIsSaving(false);
        toast.success('Catalog added successfully!');
        onHide();

        navigate('/dataset-catalog');
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f5f3ee' }}>
                <Modal.Title style={{ color: '#2c3e50' }}>Add new catalog</Modal.Title>
                <CloseButton onClick={onHide} />
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#f5f3ee' }}>
                <Form onSubmit={handleSubmit}>
                    <InputGroup className={`${styles.inputGroup} mx-auto`}>
                        <InputGroup.Text className={styles.inputLabel}>Catalog Name</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Example catalog name"
                            value={catalogName}
                            onChange={(e) => setCatalogName(e.target.value)}
                            isInvalid={!!nameError}
                            required
                        />
                    </InputGroup>
                    {nameError && (
                        <Form.Text className="text-danger" style={{ marginLeft: '10px' }}>
                            {nameError}
                        </Form.Text>
                    )}
                    <div className="d-flex justify-content-center mt-3">
                        <Button
                            type="submit"
                            style={{
                                backgroundColor: '#28a745',
                                borderColor: '#28a745',
                                borderRadius: '20px',
                                padding: '5px 20px',
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Adding...' : 'Add new catalog'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CatalogAddModal;