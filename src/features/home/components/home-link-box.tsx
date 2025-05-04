import {FC} from 'react';
import {Link} from "react-router";
import boxinfo from '../utils/homeboxesinfo.json';
import urls from '../../../assets/paths.json';
import styles from '../styles/home-link-box.module.css';

interface HomeLinkBox {
  name: string;
}

const HomeLinkBox: FC<HomeLinkBox> = (props) => {
  const info = boxinfo[props.name as keyof typeof boxinfo];
  const links = urls.modules[props.name as keyof typeof urls.modules]
  
  return (
    <div className={styles.box}>
      <div className={styles.title}>{info.title}</div>
      <div className={styles.description}>{info.description}</div>
      <Link className={styles.link} to={links.catalog}>Go to Page</Link>
    </div>
  )
}

export default HomeLinkBox;
