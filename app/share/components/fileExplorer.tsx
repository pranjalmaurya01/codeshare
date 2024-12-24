'use client';

import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import getFirebaseApp from '@/firebase/config';
import { createNewFile, softDeleteFile } from '@/firebase/query';
import { getRandomId } from '@/lib/utils';
import { ContextMenuContent } from '@radix-ui/react-context-menu';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import {
  ListCollapseIcon as CollapseAll,
  FileIcon,
  RefreshCw,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from './EditorContext';
import { FileFireBaseI } from './editorSideMenu';
import { TabState } from './editorTabs';

interface FileExplorerProps {
  onToggle: () => void;
}

export function FileExplorer({}: FileExplorerProps) {
  const { id, setFileState, setTabs } = useContext(EditorContext);
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
        let files = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as FileFireBaseI[];
        files = files.filter((f) => !f.isDelete);

        setFileState(
          files.sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          })
        );
        setTabs((prev) => {
          let active = prev.active;
          const newTabs: TabState[] = [];
          prev.all.forEach((a) => {
            const t = files.find((f) => f.fId === a.id);
            if (t) {
              a.label = t.path;
              newTabs.push(a);
            }
          });
          if (newTabs.length && !newTabs.some((t) => t.id === prev.active)) {
            active = newTabs[newTabs.length - 1].id;
          }
          return {
            all: newTabs,
            active: active,
          };
        });
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
            const fId = getRandomId();
            if (typeof fileName === 'string') {
              const newFile: FileFireBaseI = {
                created_at: new Date().toISOString(),
                fId,
                path: fileName,
                owner: 'pranjal',
                project_id: id,
              };
              setTabs((prev) => ({
                ...prev,
                active: fId,
                all: [
                  ...prev.all,
                  {
                    id: fId,
                    label: fileName,
                  },
                ],
              }));

              await createNewFile(newFile);
            }
          }}
        >
          <Input
            id='new-file'
            placeholder='<some-file-name>'
            className='h-6 w-[90%] px-1 rounded-sm'
            type='text'
            autoComplete='false'
            name='filename'
            autoFocus
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

  const renderTree = (tree: FileFireBaseI[]) => {
    return tree.map((key) => {
      return (
        <div key={key.fId}>
          <ContextMenu>
            <ContextMenuTrigger>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-full justify-start hover:bg-zinc-800'
                onClick={() => {
                  setTabs((prev) => {
                    const filtered = prev.all.filter((p) => p.id === key.fId);

                    return {
                      active: key.fId,
                      all: filtered.length
                        ? [...prev.all]
                        : [...prev.all, { id: key.fId, label: key.path }],
                    };
                  });
                }}
              >
                <FileIcon className='mr-2 h-4 w-4 text-blue-400' />
                {key.path}
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent className='w-32'>
              <ContextMenuItem
                className='cursor-pointer'
                onClick={() => {
                  console.log(key.id);
                }}
              >
                Rename
              </ContextMenuItem>
              <ContextMenuItem
                className='cursor-pointer'
                onClick={async () => {
                  await softDeleteFile(key);
                }}
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      );
    });
  };

  return <div className='space-y-1'>{renderTree(fileState)}</div>;
}
