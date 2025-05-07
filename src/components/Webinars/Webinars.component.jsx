import styles from './Webinars.module.css';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const res = await fetch('/api/webinars');
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setWebinars(data);
      } catch (error) {
        console.error('Failed to load webinars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (!webinars.length)
    return <p className={styles.notFound}>No webinars found.</p>;

  return (
    <div className={styles.webinars}>
      <ul className={styles.webinars__list}>
        {webinars.map((webinar) => {
          return (
            <li
              key={webinar._id}
              className={`${styles.webinars__item} ${styles.webinar}`}
            >
              <Link
                className={styles.webinar__link}
                href={`/webinars/${webinar._id}`}
              >
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Title</div>
                  <p className={styles.webinar__value}>{webinar.title}</p>
                </div>
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Description</div>
                  <p className={styles.webinar__value}>{webinar.description}</p>
                </div>
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Date</div>
                  <p className={styles.webinar__value}>{webinar.date}</p>
                </div>
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Duration</div>
                  <p className={styles.webinar__value}>{webinar.duration}</p>
                </div>
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Price</div>
                  <p className={styles.webinar__value}>{webinar.price}</p>
                </div>
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Agenda</div>
                  <ul className={styles.webinar__agendaList}>
                    {webinar.agenda.map((item, index) => (
                      <li className={styles.agendaItem} key={index}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.webinar__contentContainer}>
                  <div className={styles.webinar__property}>Speakers</div>
                  <ul className={styles.webinar__speakersList}>
                    {webinar.speakers.map((speaker, index) => {
                      return (
                        <li
                          className={`${styles.webinar__speakerItem} ${styles.speaker}`}
                          key={index}
                        >
                          {Object.entries(speaker).map(
                            ([key, value], index) => {
                              return (
                                <div
                                  className={styles.speaker__content}
                                  key={index}
                                >
                                  <div className={styles.speaker__key}>
                                    {key}
                                  </div>
                                  <p className={styles.speaker__value}>
                                    {value}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
