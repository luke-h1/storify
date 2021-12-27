/* eslint-disable jsx-a11y/label-has-associated-control */
import classnames from 'classnames';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { adminLinks, authLinks, noAuthLinks } from '../data/navLinks';
import { useMeQuery } from '../generated/graphql';
import { createurqlClient } from '../utils/createUrqlClient';
import { isServer } from '../utils/isServer';
import styles from './nav.module.css';

interface NavProps {
  className?: string;
}

const Nav = ({ className }: NavProps) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  return (
    <nav className={classnames(styles.nav, className)}>
      <Link href="/">
        <a className={styles.siteLogo}>Storify</a>
      </Link>
      <ul>
        {data?.me &&
          !data?.me.isAdmin &&
          authLinks.map(link => (
            <li key={link.id}>
              <Link href={link.slug}>
                <a>{link.text}</a>
              </Link>
            </li>
          ))}
        {data?.me &&
          data?.me.isAdmin &&
          adminLinks.map(link => (
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
    </nav>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(Nav);
