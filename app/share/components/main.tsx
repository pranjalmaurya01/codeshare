'use client';
// https://www.npmjs.com/package/@uiw/react-codemirror

import { cn, getRandomId } from '@/lib/utils';
import { Suspense, useEffect, useState } from 'react';
import CodeMirrorEditor from './editor';
import { EditorContext } from './EditorContext';
import { EditorSidebar } from './editorSideMenu';
import { EditorTabs, TabState } from './editorTabs';

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
    active: 'def',
    all: [
      {
        id: 'def',
        label: `new file`,
        path: 'filepath',
        isModified: false,
      },
    ],
  });

  function createNewFile() {
    const newFile = {
      id: getRandomId(),
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
      <EditorContext.Provider value={{ id, theme: null }}>
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
                  <CodeMirrorEditor
                    isEditorReady={isEditorReady}
                    setIsEditorReady={setIsEditorReady}
                  />
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
