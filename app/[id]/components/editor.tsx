'use client';
// https://www.npmjs.com/package/@uiw/react-codemirror

import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useState } from 'react';

function Editor() {
  const [value, setValue] = useState('');

  const onChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  return (
    <CodeMirror
      value={value}
      height='100vh'
      onChange={onChange}
      theme={vscodeDark}
    />
  );
}
export default Editor;
