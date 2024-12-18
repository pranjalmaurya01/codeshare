import Editor from './components/editor';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <Editor id={id} />
    </div>
  );
}
