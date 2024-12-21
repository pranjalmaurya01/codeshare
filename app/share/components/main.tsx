'use client';
// https://www.npmjs.com/package/@uiw/react-codemirror

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { EditorContext } from './EditorContext';
import { EditorSidebar } from './editorSideMenu';
import { EditorTabs, TabState } from './editorTabs';

const CodeMirrorEditor = dynamic(() => import('./editor'), {
  ssr: false,
});

export interface EditorReadyI {
  isSynced: boolean;
  showEditor: boolean;
}

function Editor({ id }: { id: string | null }) {
  const [isEditorReady, setIsEditorReady] = useState<EditorReadyI>({
    isSynced: false,
    showEditor: false,
  });

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
    <Suspense fallback={<div className='h-screen w-screen bg-black/90' />}>
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
                <>
                  {!isEditorReady.showEditor && (
                    <div className='flex-1 bg-black/90 h-full' />
                  )}
                  {tabs.all.map((t) => (
                    <div
                      key={t.id}
                      className={cn(t.id === tabs.active ? 'h-full' : 'h-0')}
                    >
                      <CodeMirrorEditor
                        isEditorReady={isEditorReady}
                        activeTabId={tabs.active}
                        setIsEditorReady={setIsEditorReady}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div
                  className={cn(
                    'border-b border-zinc-800 h-full bg-black/90 text-white'
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
