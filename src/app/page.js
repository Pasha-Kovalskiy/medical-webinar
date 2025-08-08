'use client';

import Image from 'next/image';
import styles from './page.module.css';

import Nav from '@/components/Nav/Nav.component';

async function getWebinars() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webinars`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Ошибка загрузки вебинаров');
  }

  return res.json();
}

export default function Home() {
  // const webinars = await getWebinars();

  return (
    <div className={styles.home}>
      <Nav />
    </div>
  );
}
