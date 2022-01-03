import { NextPage } from 'next';
import Page from '../components/Page';

const NotFound: NextPage = () => {
  return (
    <Page title="Not Found" description="route not found">
      <h1 className="text-4xl">404 page not found</h1>
    </Page>
  );
};
export default NotFound;
