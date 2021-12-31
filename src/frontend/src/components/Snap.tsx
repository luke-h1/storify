import styles from './snap.module.scss';

interface Props {
  product: {
    __typename?: 'Product' | undefined;
    id: number;
    brand: string;
    descriptionSnippet: string;
    image: string;
    name: string;
    price: number;
    creator: { __typename?: 'User' | undefined; fullName: string };
  };
}

const Snap = ({ product }: Props) => {
  return (
    <a className={styles.card}>
      <img alt={product.name} className={styles.img} />
      <div className={styles.body}>
        <h3>
          {product.name} <span className={styles.arrow}>&rarr;</span>
        </h3>
        <p>{product.price}</p>
      </div>
    </a>
  );
};
export default Snap;
