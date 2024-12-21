'use client';

import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { useSyncedStore } from '@syncedstore/react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { MonacoBinding } from 'y-monaco';
import { EditorReadyI } from './main';
import { awareness, provider, store } from './store';

// Function to generate a random color
function generateRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

// Function to add user selection style to the DOM
function addUserSelectionStyle(userId: number, color: string) {
  const styleTag = document.createElement('style');
  styleTag.id = `user-style-monaco`;
  styleTag.innerHTML = `
.yRemoteSelection {
  background-color: ${color};
}
.yRemoteSelectionHead {
  position: absolute;
  border-left: ${color} solid 2px;
  border-top: ${color} solid 2px;
  border-bottom: ${color} solid 2px;
  height: 100%;
  box-sizing: border-box;
}
.yRemoteSelectionHead::after {
  position: absolute;
  content: ' ';
  border: 3px solid ${color};
  border-radius: 4px;
  left: -4px;
  top: -5px;
}
  `;
  document.head.appendChild(styleTag);
}

const CodeMirrorEditor = ({
  isEditorReady,
  setIsEditorReady,
}: {
  isEditorReady: EditorReadyI;
  setIsEditorReady: Dispatch<SetStateAction<EditorReadyI>>;
}) => {
  const editorRef = useRef(null);
  // const monaco = useMonaco();
  const state = useSyncedStore(store);
  // const undoManager = new Y.UndoManager(state.doc);

  useEffect(() => {
    provider.on('sync', (event) => {
      setIsEditorReady((prev) => ({ ...prev, isSynced: event }));
    });

    return () => {
      console.log('destroy');
      // provider.awareness.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    provider.awareness.setLocalStateField('user', {
      name: 'Anonymous ' + Math.floor(Math.random() * 100),
      color: generateRandomColor(),
    });
    new MonacoBinding(
      state.doc,
      editor.getModel(),
      new Set([editor]),
      awareness
    );

    // Update user styles dynamically
    setIsEditorReady((prev) => ({ ...prev, showEditor: true }));
  }

  // Listen to changes in awareness
  awareness.on('change', ({ added }: any) => {
    added.forEach((userId: number) => {
      addUserSelectionStyle(
        userId,
        awareness.getStates().get(userId)?.user.color
      );
    });
  });

  return (
    <Editor
      theme='vs-dark'
      onMount={handleEditorDidMount}
      className={cn(
        'flex-1 w-fit',
        isEditorReady.showEditor ? 'block' : 'hidden'
      )}
    />
  );
};

export default CodeMirrorEditor;
