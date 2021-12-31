import styles from './loader.module.scss';

const Loader = () => {
  return (
    <div className="container">
      <div className={styles.spin} />
    </div>
  );
};
export default Loader;
