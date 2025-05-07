import styles from './page.module.css';

import { connectDB } from '@/lib/mongoose';
import Webinar from '@/models/Webinar';

export default async function WebinarPage({ params }) {
  const { id } = params;
  await connectDB();
  const webinar = await Webinar.findById(id);

  if (!webinar) {
    return <p className={styles.notFound}>Webinar not found</p>;
  }

  return (
    <div>
      <h1>{webinar.title}</h1>
    </div>
  );
}
