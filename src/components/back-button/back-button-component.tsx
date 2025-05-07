import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons'
import { Link } from 'react-router';
import styles from "./back-button-component.module.css";

interface BackButtonComponentProps {
    to: string
}

export function BackButtonComponent({ to }: BackButtonComponentProps) {
    return (
        <Button variant="ghost" className={styles.backBtn}>
        <Link to={to}>
          <ArrowLeft />
        </Link>
      </Button>
    );
  }