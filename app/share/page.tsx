'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Editor from './components/editor';

// https://docs.convex.dev/client/react/nextjs/server-rendering

export default function Page() {
  return (
    <Suspense>
      <EditorWrapper />
    </Suspense>
  );
}

function EditorWrapper() {
  const searchParams = useSearchParams();

  return <Editor id={searchParams.get('id')} />;
}
