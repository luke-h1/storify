import classnames from 'classnames';
import { withUrqlClient } from 'next-urql';
import Loader from '../components/Loader';
import Page from '../components/Page';
import Snap from '../components/Snap';
import { useProductsQuery, useMeQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';
import styles from './index.module.scss';

const Home = () => {
  const [{ data, fetching }] = useProductsQuery({
    pause: isServer(),
  });

  if (!data && fetching) {
    return <Loader />;
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
        <div className={styles.cardContainer}>
          {data?.products &&
            data?.products.map(p => <Snap product={p} key={p.id} />)}
        </div>
      </div>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Home);
