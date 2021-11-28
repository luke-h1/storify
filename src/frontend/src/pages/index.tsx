import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Nav from '../components/Nav';
import { createurqlClient } from '../utils/createUrqlClient';

const Home: NextPage = () => {
  return <p>hello</p>;
};

export default Home;
