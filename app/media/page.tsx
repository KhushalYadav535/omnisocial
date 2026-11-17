'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MediaRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/content-studio?tab=media');
  }, [router]);
  return null;
}
