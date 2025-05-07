import { Suspense } from 'react';
import AdminPage from './AdminPage';

export default function Admin() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AdminPage />
    </Suspense>
  );
}
