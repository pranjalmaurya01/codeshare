'use client';

import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { addUserSelectionStyle } from '../utils';
import { EditorReadyI, mainYDoc } from './main';

const CodeMirrorEditor = ({
  provider,
  activeTabId,
  isEditorReady,
  setIsEditorReady,
}: {
  provider: WebsocketProvider;
  activeTabId: string;
  isEditorReady: EditorReadyI;
  setIsEditorReady: Dispatch<SetStateAction<EditorReadyI>>;
}) => {
  const editorRef = useRef<any>(null);
  const { awareness } = provider;

  useEffect(() => {
    awareness.on('change', ({ added, updated }: any) => {
      [...added, ...updated].forEach((userId: number) => {
        if (
          awareness.getStates().get(userId)?.user &&
          awareness.getStates().get(userId)?.user.color
        ) {
          addUserSelectionStyle(awareness.getStates().get(userId)?.user.color);
        }
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEditorDidMount(editor: any) {
    setIsEditorReady((prev) => ({ ...prev, showEditor: true }));
    editorRef.current = editor;

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
