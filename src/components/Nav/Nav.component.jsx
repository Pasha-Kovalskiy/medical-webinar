'use client';

import styles from './Nav.module.css';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from '../icons/logo/logo.component';

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className={styles.nav}>
      <div className={styles.nav__container}>
        <div className={styles.nav__logoContainer}>
          <Link className={styles.nav__logoLink} href={'/'}>
            <Logo />
          </Link>
        </div>
        <ul className={styles.nav__list}>
          <li className={styles.nav__item}>
            <Link
              className={`${styles.nav__link} ${
                pathname === '/' ? styles.active : ''
              }`}
              href={'/'}
            >
              Головна
            </Link>
          </li>
          <li className={styles.nav__item}>
            <Link
              className={`${styles.nav__link} ${
                pathname === '/webinars' ? styles.active : ''
              }`}
              href={'/webinars'}
            >
              Каталог курсів
            </Link>
          </li>
          <li className={styles.nav__item}>
            <Link
              className={`${styles.nav__link} ${
                pathname === '/about' ? styles.active : ''
              }`}
              href={'/about'}
            >
              Про платформу
            </Link>
          </li>
        </ul>
        <div className={styles.nav__buttonsContainer}>
          <Link href={'/signin'} className={styles.nav__signinBtn}>
            Sign in
          </Link>
          <Link href={'/register'} className={styles.nav__signupBtn}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
