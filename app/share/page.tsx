'use client';
import { useSearchParams } from 'next/navigation';
import Editor from './components/editor';

// https://docs.convex.dev/client/react/nextjs/server-rendering

export default function Page() {
  const searchParams = useSearchParams();

  return (
    <div>
      <Editor id={searchParams.get('id')} />
    </div>
  );
}
