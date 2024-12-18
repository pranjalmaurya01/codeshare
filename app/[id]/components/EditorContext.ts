import { createContext } from 'react';

export const EditorContext = createContext<{
  theme: CSSStyleDeclaration | null;
  id: string;
}>({ theme: null, id: '' });
