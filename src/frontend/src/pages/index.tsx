import classnames from 'classnames';
import { withUrqlClient } from 'next-urql';
import Card from '../components/Card';
import Page from '../components/Page';
import { useProductsQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';
import styles from './index.module.css';

const Home = () => {
  const [{ data, fetching }] = useProductsQuery({
    pause: isServer(),
  });

  if (!data && fetching) {
    return <p>loading</p>;
  }

  return (
    <Page className="container" title="Home | storify" description="Home page">
      <div className={classnames('container', styles.hero)}>
        <h1 className={styles.greeting}>
          <span>Welcome to storify</span>
          <br />
          <p>Fictional ecommerce store</p>
        </h1>
      </div>
      <div className={classnames('container', styles.projectContainer)}>
        {data?.products ? (
          <h2>Latest Products</h2>
        ) : (
          <h2>No products available, go create one!</h2>
        )}{' '}
        <div className={styles.cardContainer}>
          {data?.products &&
            data?.products.map(p => <Card product={p} key={p.id} />)}
        </div>
      </div>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Home);
