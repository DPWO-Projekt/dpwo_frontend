import React, { FC, useState, useRef } from 'react';
import { Modal, Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from '../styles/dataset-edit.module.css';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { CatalogService } from '../api/dataset-catalog-service';
import { Catalog } from '../types/catalog';
import { addCatalog } from '../api/catalog-add';
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

        const isUnique = !currentCatalog.subCatalogs?.some(c => c.title.toLowerCase() === catalogName.toLowerCase());
        if (!isUnique) {
            setNameError('Catalog name has to be unique!');
            setIsSaving(false);
            return;
        }

        console.log(currentCatalog)

        const newCatalog: Catalog = {
            title: catalogName,
            description: 'test',
            datasets: [],
            subCatalogs: [],
            parentCatalog: currentCatalog.id !== "root" ? currentCatalog.id : undefined,
        };

        try {
            const createdCatalog = await addCatalog(newCatalog);
            currentCatalog.subCatalogs = currentCatalog.subCatalogs || [];
            currentCatalog.subCatalogs.push(createdCatalog);
            setCatalogName('');
            toast.success('Catalog added successfully!');
            onHide();
            navigate('/dataset-catalog');
        } catch (error) {
            setNameError("Błąd podczas dodawania katalogu. Sprawdź konsolę.");
        } finally {
            setIsSaving(false);
        }
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