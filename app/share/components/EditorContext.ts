import { createContext, Dispatch, SetStateAction } from 'react';
import { FileFireBaseI } from './editorSideMenu';
import { TabsStateI } from './main';

export const EditorContext = createContext<{
  activeTabId: string;
  id: string;
  fileState: FileFireBaseI[];
  setFileState: Dispatch<SetStateAction<FileFireBaseI[]>>;
  setTabs: Dispatch<SetStateAction<TabsStateI>>;
}>({
  id: '',
  activeTabId: '',
  fileState: [],
  setFileState: () => {},
  setTabs: () => {},
});
