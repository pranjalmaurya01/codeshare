import { Files, Search, Settings, Users } from 'lucide-react';
import { FileStructure, SidebarIcon } from './editorSideMenu';

export const SIDEBAR_ICONS: SidebarIcon[] = [
  { name: 'files', icon: Files, label: 'Explorer' },
  { name: 'search', icon: Search, label: 'Search' },
  { name: 'accounts', icon: Users, label: 'Accounts' },
  { name: 'settings', icon: Settings, label: 'Settings' },
];

export const PROJECT_FILES: FileStructure = {
  'package.json': '',
  'tsconfig.json': '',
  src: {
    'app.tsx': 'tsx',
    'index.tsx': 'tsx',
    styles: {
      'globals.css': 'css',
      'components.css': 'css',
    },
  },
};
