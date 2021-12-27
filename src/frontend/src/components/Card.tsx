import Link from 'next/link';
import styles from './card.module.css';

interface Props {
  product: {
    __typename?: 'Product' | undefined;
    id: number;
    brand: string;
    categories: string[];
    descriptionSnippet: string;
    image: string;
    name: string;
    price: number;
    creator: {
      __typename?: 'User' | undefined;
      fullName: string;
    };
  };
}

const Card = ({ product }: Props) => {
  return (
    <Link href={`/products/${product.id}`}>
      <a className={styles.card}>
        <img alt={product.name} className={styles.img} src={product.image} />
        <div className={styles.body}>
          <h3>
            {product.name} <span className={styles.arrow}>&rarr;</span>
          </h3>
          <p>{product.descriptionSnippet}</p>
        </div>
      </a>
    </Link>
  );
};
export default Card;
