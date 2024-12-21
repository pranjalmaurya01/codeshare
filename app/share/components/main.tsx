'client only';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';
import { generateRandomColor } from '../utils';
import { EditorContext } from './EditorContext';
import { EditorSidebar } from './editorSideMenu';
import { EditorTabs, TabState } from './editorTabs';

export const mainYDoc = new Doc();

const CodeMirrorEditor = dynamic(() => import('./editor'), {
  ssr: false,
});

function uniqueInteger() {
  return typeof window !== 'undefined'
    ? Date.now() + Math.floor(Math.random() * 100000)
    : '';
}

export interface EditorReadyI {
  isSynced: boolean;
  showEditor: boolean;
}

function Editor() {
  const [isEditorReady, setIsEditorReady] = useState<EditorReadyI>({
    isSynced: false,
    showEditor: false,
  });

  const router = useRouter();

  const searchParams = useSearchParams();
  const sid = searchParams.get('id');
  const id = sid && sid.length > 8 ? sid : '' + uniqueInteger();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('id', id);
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const provider = useMemo(() => {
    return new WebsocketProvider(
      process.env.NEXT_PUBLIC_SIGNALING_WEBSOCKET_SERVER!,
      id,
      mainYDoc
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    provider.on('sync', (event) => {
      provider.awareness.setLocalStateField('user', {
        name: 'Anonymous ' + Math.floor(Math.random() * 100),
        color: generateRandomColor(),
      });
      setIsEditorReady((prev) => ({ ...prev, isSynced: event }));
    });
    // return () => {
    //   provider.destroy(); // Cleanly close the connection
    // };
  }, [provider]);

  const [tabs, setTabs] = useState<{ active: string; all: TabState[] }>({
    active: 'a',
    all: [
      {
        id: 'a',
        label: `new file`,
        path: 'filepath',
        isModified: false,
      },
    ],
  });

  function createNewFile() {
    const newFile = {
      id: 'b',
      label: `new file`,
      path: 'filepath',
      isModified: false,
    };

    setTabs((prev) => ({
      ...prev,
      all: [...prev.all, newFile],
      active: newFile.id,
    }));
  }

  // smoothly show black background incase all files have been closed and then a file is opened
  useEffect(() => {
    if (!tabs.active) {
      setIsEditorReady((prev) => ({ ...prev, showEditor: true }));
    }
  }, [tabs.active]);

  return (
    <Suspense fallback={<div className='h-screen w-screen ' />}>
      <EditorContext.Provider value={{ id, activeTabId: tabs.active }}>
        <div className='flex'>
          <EditorSidebar />
          <div className='flex-1'>
            <div className='flex flex-col h-screen'>
              <EditorTabs
                onTabClose={(id: string) => {
                  setTabs((prev) => {
                    const openTabs = prev.all.filter((t) => t.id !== id);
                    return {
                      ...prev,
                      all: openTabs,
                      active: openTabs.length ? openTabs[0].id : '',
                    };
                  });
                }}
                onTabChange={(id: string) => {
                  setTabs((prev) => ({ ...prev, active: id }));
                }}
                tabs={tabs.all}
                activeTab={tabs.active}
                onNewFileCreate={createNewFile}
              />
              {tabs.active ? (
                <CodeMirrorEditor
                  key={tabs.active}
                  provider={provider}
                  isEditorReady={isEditorReady}
                  activeTabId={tabs.active}
                  setIsEditorReady={setIsEditorReady}
                />
              ) : (
                <div
                  className={cn(
                    'border-b border-zinc-800 h-full bg-black text-white'
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    </Suspense>
  );
}
export default Editor;
