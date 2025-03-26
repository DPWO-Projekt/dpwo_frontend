import React, { FC } from 'react';
import { Form, Button, InputGroup, CloseButton } from 'react-bootstrap';
import styles from './DatasetAdd.module.css'
import { Link } from 'react-router';

interface DatasetAddProps { }

const DatasetAdd: FC<DatasetAddProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Link to={'/'}>Home</Link>
        <CloseButton></CloseButton>
      </div>
      
      <div className={styles.header}>
        Add dataset definition
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
            <option>English</option>
            <option>Español</option>
            <option>Polski</option>
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
          Add
        </Button>
      </Form>
    </div>

  );
};

export default DatasetAdd;
