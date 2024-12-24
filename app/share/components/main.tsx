'client only';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';
import { generateRandomColor } from '../utils';
import { EditorContext } from './EditorContext';
import { EditorSidebar, FileFireBaseI } from './editorSideMenu';
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

export interface TabsStateI {
  active: string;
  all: TabState[];
}

function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sid = searchParams.get('id');
  const id = sid && sid.length > 8 ? sid : '' + uniqueInteger();
  const providerRef = useRef<null | WebsocketProvider>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('id', id);
    router.push(`?${params.toString()}`);

    if (!providerRef.current) {
      providerRef.current = new WebsocketProvider(
        process.env.NEXT_PUBLIC_SIGNALING_WEBSOCKET_SERVER!,
        id,
        mainYDoc
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isEditorReady, setIsEditorReady] = useState<EditorReadyI>({
    isSynced: false,
    showEditor: false,
  });
  const [fileState, setFileState] = useState<FileFireBaseI[]>([]);
  const [tabs, setTabs] = useState<TabsStateI>({
    active: '',
    all: [],
  });

  useEffect(() => {
    const provider = providerRef.current;
    if (provider) {
      provider.on('sync', (event) => {
        provider.awareness.setLocalStateField('user', {
          name: 'Anonymous ' + Math.floor(Math.random() * 100),
          color: generateRandomColor(),
        });
        setIsEditorReady((prev) => ({ ...prev, isSynced: event }));
      });
    }
    return () => {
      // provider?.destroy();
    };
  }, [providerRef]);

  // smoothly show black background incase all files have been closed and then a file is opened
  useEffect(() => {
    setIsEditorReady((prev) => ({
      ...prev,
      showEditor: !!tabs.active.length,
    }));
  }, [tabs.active]);

  return (
    <Suspense fallback={<div className='h-screen w-screen ' />}>
      <EditorContext.Provider
        value={{
          id,
          activeTabId: tabs.active,
          fileState,
          setFileState,
          setTabs,
        }}
      >
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
                // TODO:
                onNewFileCreate={() => {}}
              />
              {tabs.active ? (
                <CodeMirrorEditor
                  key={tabs.active}
                  provider={providerRef.current}
                  isEditorReady={isEditorReady}
                  activeTabId={tabs.active}
                  setIsEditorReady={setIsEditorReady}
                />
              ) : (
                <div className={cn('h-full flex justify-center items-center')}>
                  <div>
                    <h1 className='text-center text-lg'>
                      {tabs.all.length ? 'Select a file.' : 'Create a file'}
                    </h1>
                    <h2 className='text-center'>
                      Made with ❤️ by{' '}
                      <a
                        href='https://pranjalmaurya.vercel.app/'
                        className='underline'
                      >
                        Pranjal
                      </a>
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    </Suspense>
  );
}
export default Editor;
