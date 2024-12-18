'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Editor from './components/editor';

// https://docs.convex.dev/client/react/nextjs/server-rendering

function EditorWrapper() {
  const searchParams = useSearchParams();

  return <Editor id={searchParams.get('id')} />;
}

export default function Page() {
  return (
    <Suspense>
      <EditorWrapper />
    </Suspense>
  );
}
