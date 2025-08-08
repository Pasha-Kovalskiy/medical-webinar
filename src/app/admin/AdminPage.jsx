'use client';

import styles from './page.module.css';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import NewWebinarForm from '@/components/NewWebinarForm/NewWebinarForm.component';
import Webinars from '@/components/Webinars/Webinars.component';

export default function AdminPage() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateWebinarFormDisplayed, setIsCreateWebinarFormDisplayed] =
    useState(false);

  useEffect(() => {
    async function fetchWebinars() {
      try {
        const res = await fetch('/api/webinars');
        if (!res.ok) {
          throw new Error('Ошибка загрузки вебинаров!');
        }
        const data = await res.json();
        setWebinars(data);
      } catch (error) {
        console.error('Ошибка: ', error);
        setError(error.message || 'Неизвестная ошибка.');
      } finally {
        setLoading(false);
      }
    }

    fetchWebinars();
  }, []);

  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const secret = process.env.NEXT_PUBLIC_ADMIN_KEY;

  const handleCreateWebinarButtonClick = () => {
    setIsCreateWebinarFormDisplayed((prev) => !prev);
  };

  console.log(key);
  console.log(secret);

  if (key !== secret) {
    return (
      <div className="accessDenied">
        <h1>Access denied: Invalid key.</h1>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <div className={`${styles.adminPage__nav} ${styles.nav}`}>
        <div className={styles.nav__top}>
          <div className={styles.nav__logo}>Admin Panel</div>
          <div className={styles.nav__burger}>
            <span></span>
          </div>
        </div>

        <div className={`${styles.nav__navSection} ${styles.navSection}`}>
          <h4 className={styles.navSection__header}>MAIN MENU</h4>
          <ul className={`${styles.navSection__navList} ${styles.navList}`}>
            <li className={styles.navList__item}>
              <Link href={'/admin?key=mySuperSecretKey'}>Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={`${styles.adminPage__mainContent} ${styles.mainContent}`}>
        <div className={`${styles.mainContent__topBar} ${styles.topBar}`}></div>
        <div className={`${styles.mainContent__dashboard} ${styles.dashboard}`}>
          <h3 className={styles.dashboard__header}>Dashboard</h3>
          <div className={styles.dashboard__content}>
            <section className={`${styles.webinarsSection}`}>
              <div className={styles.webinarsSection__top}>
                <h4 className={styles.webinarsSection__header}>Webinars</h4>
                <div
                  onClick={handleCreateWebinarButtonClick}
                  className={styles.webinarsSection__createWebinarBtn}
                >
                  Create Webinar
                </div>
              </div>

              {isCreateWebinarFormDisplayed && <NewWebinarForm />}
              <Webinars />

              {/* <div className={styles.webinarsSection__content}>
                <ul className={`${webinarsSection__webinarsList} ${styles.webinarsList}`}>
                  {
                    webinars.map(webinars => {
                      <li className={styles.webinarsList__item}></li>
                    })
                  }
                </ul>
              </div> */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
