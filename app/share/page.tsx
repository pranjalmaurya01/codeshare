'use client';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
const Editor = dynamic(() => import('./components/main'), { ssr: false });

// https://docs.convex.dev/client/react/nextjs/server-rendering

function EditorWrapper() {
  const searchParams = useSearchParams();

  return <Editor key={searchParams.get('id')} />;
}

export default function Page() {
  return (
    <Suspense>
      <EditorWrapper />
    </Suspense>
  );
}
