import { Files, Search, Settings, Users } from 'lucide-react';
import { FileStructure, SidebarIcon } from './editorSideMenu';

export const SIDEBAR_ICONS: SidebarIcon[] = [
  { name: 'files', icon: Files, label: 'Explorer' },
  { name: 'search', icon: Search, label: 'Search' },
  { name: 'accounts', icon: Users, label: 'Accounts' },
  { name: 'settings', icon: Settings, label: 'Settings' },
];

export const PROJECT_FILES: FileStructure = {
  'package.json': 'json',
  'tsconfig.json': 'json',
  src: {
    'app.tsx': 'tsx',
    'index.tsx': 'tsx',
    components: {
      'button.tsx': 'tsx',
      'card.tsx': 'tsx',
      'dialog.tsx': 'tsx',
      'sidebar.tsx': 'tsx',
      'search.tsx': 'tsx',
    },
    lib: {
      'utils.ts': 'ts',
      'api.ts': 'ts',
      'search.ts': 'ts',
    },
    styles: {
      'globals.css': 'css',
      'components.css': 'css',
    },
  },
};
