import styles from './loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} aria-label="loading" />
    </div>
  );
};
export default Loader;
