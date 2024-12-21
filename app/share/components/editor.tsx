'use client';

import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { MonacoBinding } from 'y-monaco';
import { addUserSelectionStyle, generateRandomColor } from '../utils';
import { EditorReadyI } from './main';
import { awareness, mainYDoc, provider } from './store';

const CodeMirrorEditor = ({
  activeTabId,
  isEditorReady,
  setIsEditorReady,
}: {
  activeTabId: string;
  isEditorReady: EditorReadyI;
  setIsEditorReady: Dispatch<SetStateAction<EditorReadyI>>;
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    provider.on('sync', (event) => {
      setIsEditorReady((prev) => ({ ...prev, isSynced: event }));
    });

    awareness.on('change', ({ added }: any) => {
      added.forEach((userId: number) => {
        addUserSelectionStyle(awareness.getStates().get(userId)?.user.color);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEditorDidMount(editor: any) {
    setIsEditorReady((prev) => ({ ...prev, showEditor: true }));
    editorRef.current = editor;
    awareness.setLocalStateField('user', {
      name: 'Anonymous ' + Math.floor(Math.random() * 100),
      color: generateRandomColor(),
    });

    const root = mainYDoc.getText(activeTabId);

    new MonacoBinding(
      root,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness
    );
  }

  return (
    <Editor
      options={{
        readOnly: !isEditorReady.isSynced,
        readOnlyMessage: {
          supportHtml: true,
          value: 'Syncing Please Wait',
        },
      }}
      theme='vs-dark'
      onMount={handleEditorDidMount}
      className={cn('flex-1 w-full animate-in')}
    />
  );
};

export default CodeMirrorEditor;
