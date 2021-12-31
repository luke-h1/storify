import Page from '../components/Page';
import styles from '../styles/404.module.scss';

const NotFound = () => {
  return (
    <Page title="Not Found" description="route not found">
      <div className={styles.notFoundText}>
        <p>404 - page not found</p>
      </div>
    </Page>
  );
};
export default NotFound;
