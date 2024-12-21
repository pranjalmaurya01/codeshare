'use client';

import { EditorState } from '@codemirror/state';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { useSyncedStore } from '@syncedstore/react';
import { basicSetup } from 'codemirror';
import React, { useEffect, useRef } from 'react';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';
import { provider, store } from './store';

type CodeMirrorEditorProps = object;

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const state = useSyncedStore(store);

  const undoManager = new Y.UndoManager(state.doc);

  useEffect(() => {
    if (editorRef.current) {
      provider.awareness.setLocalStateField('user', {
        name: 'Anonymous ' + Math.floor(Math.random() * 100),
      });
      provider.on('sync', (event) => {
        console.log(event);
      });

      const startState = EditorState.create({
        extensions: [
          basicSetup,
          oneDarkTheme,
          yCollab(state.doc, provider.awareness, { undoManager }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      editorViewRef.current = view;

      return () => {
        view.destroy();
        editorViewRef.current = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex h-[100%]'>
      <div ref={editorRef} className='flex-1 *:h-[100%] overflow-y-auto' />
    </div>
  );
};

export default CodeMirrorEditor;
