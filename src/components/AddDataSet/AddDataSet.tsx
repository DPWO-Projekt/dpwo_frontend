import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './AddDataSet.css';

function AddDataSet(){
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add dataset definition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Label>Dataset title</Form.Label>
              </Col>
              <Col>
                <Form.Control placeholder="Title"/>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Keywords (coma seperated)</Form.Label>
              </Col>
              <Col>
                <Form.Control placeholder="Keywords"/>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Language</Form.Label>
              </Col>
              <Col>
              <Form.Select aria-label="Language">
                <option value="english">English</option>
                <option value="spanish">Espanol</option>
                <option value="polish">Polski</option>
              </Form.Select>
              </Col>
            </Row>
            <Form.Control as="textarea" rows={3} placeholder="Provide dataset description..."/>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export default AddDataSet;
