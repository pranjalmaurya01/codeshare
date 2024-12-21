'use client';

import { cn } from '@/lib/utils';
import { useSyncedStore } from '@syncedstore/react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';
import { EditorReadyI } from './main';
import { provider, store } from './store';

const CodeMirrorEditor = ({
  isEditorReady,
  setIsEditorReady,
}: {
  isEditorReady: EditorReadyI;
  setIsEditorReady: Dispatch<SetStateAction<EditorReadyI>>;
}) => {
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  const state = useSyncedStore(store);
  const undoManager = new Y.UndoManager(state.doc);

  useEffect(() => {
    provider.awareness.setLocalStateField('user', {
      name: 'Anonymous ' + Math.floor(Math.random() * 100),
    });
    provider.on('sync', (event) => {
      setIsEditorReady((prev) => ({ ...prev, isSynced: event }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CodeMirror
      className={cn('flex-1', isEditorReady.showEditor ? 'block' : 'hidden')}
      ref={editorRef}
      editable={isEditorReady.isSynced}
      theme='dark'
      onCreateEditor={() => {
        setIsEditorReady((prev) => ({ ...prev, showEditor: true }));
      }}
      basicSetup={true}
      height='100%'
      extensions={[yCollab(state.doc, provider.awareness, { undoManager })]}
    />
  );
};

export default CodeMirrorEditor;
