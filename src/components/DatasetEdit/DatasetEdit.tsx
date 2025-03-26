import React, { FC } from 'react';
import { Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from './DatasetEdit.module.css'
import { Link } from 'react-router';

interface DatasetEditProps { }

const DatasetEdit: FC<DatasetEditProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Link to={'/'}>Home</Link>
        <CloseButton></CloseButton>
      </div>
      
      <div className={styles.header}>
        Edit dataset definition
      </div>
      <Form>
        <InputGroup className={`${styles.inputGroup} mx-auto`}>
          <InputGroup.Text className={`${styles.inputLabel}`}>Dataset Title</InputGroup.Text>
          <Form.Control
            className={`${styles.inputValue}`}
            placeholder="Current Title"
            aria-label="Current Title"
          />
        </InputGroup>

        <InputGroup className={`${styles.inputGroup} mx-auto`}>
          <InputGroup.Text className={`${styles.inputLabel}`}>Keywords (coma separated)</InputGroup.Text>
          <Form.Control
            className={`${styles.inputValue}`}
            placeholder="Current Keywords"
            aria-label="Current Keywords"
          />
        </InputGroup>

        <InputGroup className={`${styles.inputGroup} mx-auto`}>
          <InputGroup.Text className={`${styles.inputLabel}`}>Language</InputGroup.Text>
          <Form.Control
            as="select"
            defaultValue="Current Language"
            className={`${styles.inputValue}`}
            placeholder="Current Language"
            aria-label="Current Language"
          >
            <option>Current Language</option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </Form.Control>
        </InputGroup>

        <Form.Control
          as="textarea"
          className={`${styles.formTextArea} mx-auto`}
          placeholder="Current dataset description."
          aria-label="Current dataset description."
        />
        <Button
          className={`${styles.editButton}`}
          variant="success"
          type='submit'
        >
          Edit
        </Button>
      </Form>
    </div>

  );
};

export default DatasetEdit;
