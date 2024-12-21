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

    // Update user styles dynamically
    setIsEditorReady((prev) => ({ ...prev, showEditor: true }));
  }

  return (
    <Editor
      theme='vs-dark'
      onMount={handleEditorDidMount}
      className={cn(
        'flex-1 w-full',
        isEditorReady.showEditor ? 'block' : 'hidden'
      )}
    />
  );
};

export default CodeMirrorEditor;
