import Image from 'next/image';
import styles from './page.module.css';

async function getWebinars() {
  const res = await fetch('http://localhost:3000/api/webinars', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Ошибка загрузки вебинаров');
  }

  return res.json();
}

export default async function Home() {
  const webinars = await getWebinars();

  return <div className={styles.page}></div>;
}
