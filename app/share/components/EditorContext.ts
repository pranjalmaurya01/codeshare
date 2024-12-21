import { createContext } from 'react';

export const EditorContext = createContext<{
  activeTabId: string;
  id: string | null;
}>({ id: null, activeTabId: '' });
