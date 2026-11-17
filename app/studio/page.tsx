'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudioRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/content-studio');
  }, [router]);
  return null;
}
