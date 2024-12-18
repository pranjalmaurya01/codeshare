'use client';
// https://www.npmjs.com/package/@uiw/react-codemirror

import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorSidebar } from './editorSideMenu';

function Editor() {
  const [value, setValue] = useState('');
  // const [editorTheme,setEditorTheme] = useState('')
  const [sideBarProps, setSidebarProps] = useState<{
    theme: CSSStyleDeclaration | null;
  }>({ theme: null });
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  const onChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  useEffect(() => {
    // Use a slight delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (editorRef.current) {
        const editorElement =
          editorRef.current.editor?.querySelector('div.cm-editor');
        if (editorElement) {
          const style = window.getComputedStyle(editorElement);
          setSidebarProps((prev) => ({ ...prev, theme: style }));
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex'>
      <EditorSidebar theme={sideBarProps.theme} />
      <div className='flex-1'>
        <CodeMirror
          ref={editorRef}
          basicSetup={{
            foldGutter: true,
          }}
          value={value}
          height='100vh'
          onChange={onChange}
          theme={vscodeDark}
        />
      </div>
    </div>
  );
}
export default Editor;
