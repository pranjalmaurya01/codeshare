'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import getFirebaseApp from '@/firebase/config';
import { createNewFile } from '@/firebase/query';
import { getRandomId } from '@/lib/utils';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import {
  ListCollapseIcon as CollapseAll,
  FileIcon,
  RefreshCw,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from './EditorContext';
import { FileFireBaseI } from './editorSideMenu';

interface FileExplorerProps {
  onToggle: () => void;
}

export function FileExplorer({}: FileExplorerProps) {
  const { id, setFileState } = useContext(EditorContext);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    src: true,
    components: true,
  });

  const collapseAll = () => {
    setExpanded({});
  };

  const handleRefresh = () => {
    // Implement refresh
    console.log('Refresh file explorer');
  };

  useEffect(() => {
    let unsubscribe: any;
    (async () => {
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const filesCol = collection(db, 'files', 'projectId', id);

      unsubscribe = onSnapshot(filesCol, (snapshot) => {
        const files = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as FileFireBaseI[];
        setFileState(
          files.sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          })
        );
      });
    })();
    return () => unsubscribe?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between p-2'>
        <span className='text-sm font-medium'>{id}</span>
        <div>
          <TooltipProvider>
            <div className='flex items-center'>
              {/* <Tooltip delayDuration={0}>
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
                <TooltipContent side='bottom'>New File</TooltipContent>
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
                <TooltipContent side='bottom'>New Folder</TooltipContent>
              </Tooltip> */}
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
                <TooltipContent side='bottom'>Refresh Explorer</TooltipContent>
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
                <TooltipContent side='bottom'>Collapse All</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      <div className='flex justify-center'>
        <form
          action={async (form) => {
            const fileName = form.get('filename');

            if (typeof fileName === 'string') {
              const newFile: FileFireBaseI = {
                created_at: new Date().toISOString(),
                fId: getRandomId(),
                path: fileName,
                owner: 'pranjal',
                project_id: id,
              };

              // setFileState((prev) => {
              //   return [...prev, newFile];
              // });
              createNewFile(newFile);
            }
          }}
        >
          <Input
            placeholder='<some-file-name>'
            className='h-6 w-[90%] px-1 rounded-sm'
            type='text'
            autoComplete='false'
            name='filename'
          />
        </form>
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

function FileTree({}: FileTreeProps) {
  const { fileState, setTabs } = useContext(EditorContext);

  // const toggleExpand = (folder: string) => {
  //   setExpanded((prev) => ({
  //     ...prev,
  //     [folder]: !prev[folder],
  //   }));
  // };

  const renderTree = (tree: FileFireBaseI[]) => {
    return tree.map((key) => {
      // const currentPath = path ? `${path}/${key}` : key;
      // const isFolder = typeof value === 'object';

      // if (isFolder) {
      //   return (
      //     <div key={currentPath}>
      //       <Button
      //         variant='ghost'
      //         size='sm'
      //         onClick={() => toggleExpand(currentPath)}
      //         className='h-8 w-full justify-start hover:bg-zinc-800'
      //       >
      //         {expanded[currentPath] ? (
      //           <FolderIcon className='mr-2 h-4 w-4 text-yellow-400' />
      //         ) : (
      //           <FolderIcon className='mr-2 h-4 w-4 text-yellow-400/70' />
      //         )}
      //         {key}
      //       </Button>
      //       {expanded[currentPath] && (
      //         <div className='ml-4'>
      //           {renderTree(value as FileFireBaseI[], currentPath)}
      //         </div>
      //       )}
      //     </div>
      //   );
      // }

      return (
        <Button
          key={key.fId}
          variant='ghost'
          size='sm'
          className='h-8 w-full justify-start hover:bg-zinc-800'
          onClick={() => {
            setTabs((prev) => ({
              ...prev,
              active: key.fId,
            }));
          }}
        >
          <FileIcon className='mr-2 h-4 w-4 text-blue-400' />
          {key.path}
        </Button>
      );
    });
  };

  return <div className='space-y-1'>{renderTree(fileState)}</div>;
}
