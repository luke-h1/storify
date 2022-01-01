import { NextPage } from 'next';
import Page from '../../components/Page';

const SuccessPage: NextPage = () => {
  return (
    <Page title="Checkout Success | Storify" description="Checkout successful">
      <h1 className="success">Checkout succesful!</h1>
      <p>Thanks for the business</p>
    </Page>
  );
};
export default SuccessPage;
