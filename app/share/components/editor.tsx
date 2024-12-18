'use client';
// https://www.npmjs.com/package/@uiw/react-codemirror

import { cn, getRandomId } from '@/lib/utils';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Suspense, useEffect, useRef, useState } from 'react';
import { EditorContext } from './EditorContext';
import { EditorSidebar } from './editorSideMenu';
import { EditorTabs, TabState } from './editorTabs';

function Editor({ id }: { id: string | null }) {
  const [selectedTheme, setSelectedTheme] =
    useState<CSSStyleDeclaration | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const [tabs, setTabs] = useState<{ active: string; all: TabState[] }>({
    active: '',
    all: [],
  });
  const [value, setValue] = useState('');
  // const [editorTheme,setEditorTheme] = useState('')

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  const onChange = (val: string) => {
    setValue(val);
  };

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

  useEffect(() => {
    // Use a slight delay to ensure the DOM is fully rendered
    if (isEditorReady && editorRef.current) {
      const editorElement =
        editorRef.current.editor?.querySelector('div.cm-editor');
      if (editorElement) {
        const style = window.getComputedStyle(editorElement);
        setSelectedTheme({ ...style });
      }
    }
  }, [isEditorReady]);

  // smoothly show black background incase all files have been closed and then a file is opened
  useEffect(() => {
    if (!tabs.active) {
      setIsEditorReady(false);
    }
  }, [tabs.active]);

  return (
    <Suspense fallback={<div className='h-screen w-screen bg-black/90' />}>
      <EditorContext.Provider value={{ id, theme: selectedTheme }}>
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
                  {!isEditorReady && <div className='flex-1 bg-black/90' />}
                  <CodeMirror
                    ref={editorRef}
                    basicSetup={{
                      foldGutter: true,
                    }}
                    className={cn('flex-1', isEditorReady ? 'block' : 'hidden')}
                    height='100%'
                    value={value}
                    onChange={onChange}
                    theme={vscodeDark}
                    onCreateEditor={() => {
                      setIsEditorReady(true);
                    }}
                  />
                </>
              ) : (
                <div
                  className={cn(
                    'border-b border-zinc-800 h-full',
                    !selectedTheme && 'bg-black/90 text-white'
                  )}
                  style={{
                    backgroundColor: selectedTheme?.backgroundColor,
                    color: selectedTheme?.color,
                  }}
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
