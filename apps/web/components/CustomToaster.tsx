'use client';

import { Toaster } from 'react-hot-toast';
import SwipeableToast from '@/components/SwipeableToast';

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4500,
      }}
    >
      {(t) => <SwipeableToast t={t} />}
    </Toaster>
  );
}
