import { NextPage } from 'next';
import Page from '../../components/Page';

const ErrorPage: NextPage = () => {
  return (
    <Page title="Checkout error | Storify" description="Checkout error">
      <h1>Checkout error</h1>
      <p>Something went wrong, you haven't been charged. Try again later</p>
    </Page>
  );
};
export default ErrorPage;
