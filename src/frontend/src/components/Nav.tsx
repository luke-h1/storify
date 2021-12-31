import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useMeQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';
import styles from './nav.module.scss';

const adminLinks = [
  {
    id: 1,
    slug: '/admin/users',
    text: 'users',
  },
  {
    id: 2,
    slug: '/admin/products',
    text: 'users',
  },
  {
    id: 3,
    slug: '/admin/orders',
    text: 'users',
  },
];

const authLinks = [
  {
    id: 1,
    slug: '/products/create',
    text: 'Create Product',
  },
  {
    id: 2,
    slug: '/me/products',
    text: 'My products',
  },
  {
    id: 3,
    slug: '/me/profile',
    text: 'profile',
  },
];

const noAuthLinks = [
  {
    id: 1,
    slug: '/auth/login',
    text: 'Login',
  },
  {
    id: 2,
    slug: '/auth/register',
    text: 'Register',
  },
];

const Nav = () => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>

        {data?.me?.isAdmin &&
          adminLinks.map(link => (
            <li key={link.id}>
              <Link href={link.slug}>
                <a>{link.text}</a>
              </Link>
            </li>
          ))}

        {!data?.me?.isAdmin &&
          data?.me &&
          authLinks.map(link => (
            <li key={link.id}>
              <Link href={link.slug}>
                <a>{link.text}</a>
              </Link>
            </li>
          ))}
        {!data?.me &&
          !fetching &&
          noAuthLinks.map(link => (
            <li key={link.id}>
              <Link href={link.slug}>
                <a>{link.text}</a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
export default withUrqlClient(createurqlClient, { ssr: true })(Nav);
