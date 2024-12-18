'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ListCollapseIcon as CollapseAll,
  FileIcon,
  FilePlus,
  FolderIcon,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { PROJECT_FILES } from './constants';
import { EditorContext } from './EditorContext';
import { FileStructure } from './editorSideMenu';

interface FileExplorerProps {
  onToggle: () => void;
}

export function FileExplorer({}: FileExplorerProps) {
  const { id } = useContext(EditorContext);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    src: true,
    components: true,
  });

  const collapseAll = () => {
    setExpanded({});
  };

  const handleNewFile = () => {
    // Implement new file creation
    console.log('Create new file');
  };

  const handleNewFolder = () => {
    // Implement new folder creation
    console.log('Create new folder');
  };

  const handleRefresh = () => {
    // Implement refresh
    console.log('Refresh file explorer');
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between p-2'>
        <span className='text-sm font-medium'>{id}</span>
        <div>
          <TooltipProvider>
            <div className='flex items-center'>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={handleNewFile}
                  >
                    <FilePlus className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='bottom'
                  className='border-zinc-800 bg-zinc-900'
                >
                  New File
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={handleNewFolder}
                  >
                    <FolderPlus className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='bottom'
                  className='border-zinc-800 bg-zinc-900'
                >
                  New Folder
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={handleRefresh}
                  >
                    <RefreshCw className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='bottom'
                  className='border-zinc-800 bg-zinc-900'
                >
                  Refresh Explorer
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={collapseAll}
                  >
                    <CollapseAll className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='bottom'
                  className='border-zinc-800 bg-zinc-900'
                >
                  Collapse All
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          {/* <div className='flex items-center gap-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-6 w-6'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48 border-zinc-800 bg-zinc-900'>
              <DropdownMenuItem>
                <Save className='mr-2 h-4 w-4' />
                <span>Save Workspace</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className='mr-2 h-4 w-4' />
                <span>Refresh Explorer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6'
            onClick={onToggle}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div> */}
        </div>
      </div>
      <ScrollArea className='flex-1'>
        <div className='p-2'>
          <FileTree expanded={expanded} setExpanded={setExpanded} />
        </div>
      </ScrollArea>
    </div>
  );
}

interface FileTreeProps {
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

function FileTree({ expanded, setExpanded }: FileTreeProps) {
  const toggleExpand = (folder: string) => {
    setExpanded((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const renderTree = (tree: FileStructure, path: string = '') => {
    return Object.entries(tree).map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isFolder = typeof value === 'object';

      if (isFolder) {
        return (
          <div key={currentPath}>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => toggleExpand(currentPath)}
              className='h-8 w-full justify-start hover:bg-zinc-800'
            >
              {expanded[currentPath] ? (
                <FolderIcon className='mr-2 h-4 w-4 text-yellow-400' />
              ) : (
                <FolderIcon className='mr-2 h-4 w-4 text-yellow-400/70' />
              )}
              {key}
            </Button>
            {expanded[currentPath] && (
              <div className='ml-4'>
                {renderTree(value as FileStructure, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <Button
          key={currentPath}
          variant='ghost'
          size='sm'
          className='h-8 w-full justify-start hover:bg-zinc-800'
        >
          <FileIcon className='mr-2 h-4 w-4 text-blue-400' />
          {key}
        </Button>
      );
    });
  };

  return <div className='space-y-1'>{renderTree(PROJECT_FILES)}</div>;
}
