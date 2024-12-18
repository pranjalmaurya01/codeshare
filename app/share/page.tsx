'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Editor from './components/editor';

// https://docs.convex.dev/client/react/nextjs/server-rendering

export default function Page() {
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<div className='h-screen w-screen bg-black/90' />}>
      <Editor id={searchParams.get('id')} />
    </Suspense>
  );
}
