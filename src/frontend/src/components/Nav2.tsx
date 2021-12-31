import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { Theme, getTheme, getNewTheme } from '../utils/theme';
import ListIcon from './icons/List';
import styles from './nav.module.scss';

const loggedInLinks: { id: number; text: string; slug: string }[] = [
  {
    id: 1,
    text: 'Create product',
    slug: '/products/create',
  },
  {
    id: 2,
    text: 'My orders',
    slug: '/me/orders',
  },
  {
    id: 3,
    text: 'Profile',
    slug: '/me/profile',
  },
];

const adminLinks: { id: number; text: string; slug: string }[] = [
  {
    id: 1,
    text: 'Users',
    slug: '/admin/users',
  },
  {
    id: 2,
    text: 'Products',
    slug: '/admin/products',
  },
];

const unauthenticatedLinks: { id: number; text: string; slug: string }[] = [
  {
    id: 1,
    text: 'Login',
    slug: '/auth/login',
  },
  {
    id: 2,
    text: 'Register',
    slug: '/auth/register',
  },
];

const Nav2 = () => {
  const router = useRouter();
  const isActive = (str: string) => {
    const active = router.pathname.includes(str);
    return active && styles.navLinkActive;
  };
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const [theme, setTheme] = useState<Theme>('LIGHT');
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  useEffect(() => {
    const handler = () => {
      ref.current?.classList.remove(styles.menuActive);
    };

    const listItems = document.querySelectorAll('#navUlList li');

    listItems.forEach(li => {
      li.addEventListener('click', handler);
    });
    return () => {
      listItems.forEach(li => {
        li.removeEventListener('click', handler);
      });
    };
  }, []);

  function handleThemeClick() {
    const newTheme = getNewTheme(theme);
    setTheme(newTheme);
  }

  function handleNavClick() {
    const classList = ref.current?.classList;

    if (classList?.contains(styles.menuActive)) {
      classList.remove(styles.menuActive);
    } else {
      classList?.add(styles.menuActive);
    }
  }
  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <div className={styles.navTitle}>
          <Link href="/">
            <a>Products</a>
          </Link>
        </div>
        <div className={styles.navLinksContainer}>
          <ul
            style={{ minWidth: '360px' }}
            id="navUlList"
            ref={ref}
            className={styles.navLinks}
          >
            {data?.me?.isAdmin &&
              adminLinks.map(link => (
                <li
                  className={classnames(
                    styles.navLink,
                    isActive(`/${link.slug}`),
                  )}
                  key={link.id}
                >
                  <Link href={link.slug}>
                    <a>{link.text}</a>
                  </Link>
                </li>
              ))}
            {data?.me &&
              !data?.me.isAdmin &&
              loggedInLinks.map(link => (
                <li
                  className={classnames(
                    styles.navLink,
                    isActive(`/${link.slug}`),
                  )}
                  key={link.id}
                >
                  <Link href={link.slug}>
                    <a>{link.text}</a>
                  </Link>
                </li>
              ))}
            {!data?.me &&
              unauthenticatedLinks.map(link => (
                <li
                  className={classnames(
                    styles.navLink,
                    isActive(`/${link.slug}`),
                  )}
                  key={link.id}
                >
                  <Link href={link.slug}>
                    <a>{link.text}</a>
                  </Link>
                </li>
              ))}
          </ul>
          <button
            aria-label="open navigation menu"
            onClick={handleNavClick}
            type="button"
            className={classnames('btn', 'icon-btn', styles.menuBtn)}
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};
