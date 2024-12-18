import { createContext } from 'react';

export const EditorContext = createContext<{
  theme: CSSStyleDeclaration | null;
  id: string | null;
}>({ theme: null, id: null });
