'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { EditorContext } from './EditorContext';

export interface TabState {
  id: string;
  path: string;
  label: string;
  isModified?: boolean;
}

interface EditorTabsProps {
  tabs: TabState[];
  activeTab?: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export function EditorTabs({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
}: EditorTabsProps) {
  const { theme } = useContext(EditorContext);

  return (
    <div
      className={cn(
        'border-b border-zinc-800',
        !theme && 'bg-black/90 text-white'
      )}
      style={{ backgroundColor: theme?.backgroundColor, color: theme?.color }}
    >
      <ScrollArea className='w-full' type='scroll'>
        <div className='flex h-8'>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant='ghost'
              size='sm'
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'group h-8 rounded-none border-r border-zinc-800 flex items-center justify-end',
                activeTab === tab.id && 'bg-zinc-800'
              )}
            >
              <span className='max-w-[160px] truncate text-sm'>
                {tab.label}
              </span>
              {tab.isModified ? (
                <span className='ml-2 flex h-2 w-2'>
                  <span className='absolute inline-flex h-2 w-2'>
                    <span className='absolute inline-flex h-full w-full animate-none rounded-full bg-blue-400' />
                  </span>
                </span>
              ) : (
                // Replace the inner Button with a span for the close icon
                <span
                  onClick={(e) => {
                    onTabClose(tab.id);
                    e.stopPropagation(); // Prevent the close button from triggering the tab change
                  }}
                  className={cn(
                    'rounded-none opacity-0 hover:bg-zinc-700 group-hover:opacity-100',
                    activeTab === tab.id && 'opacity-100',
                    'flex items-center justify-center'
                  )}
                >
                  <X className='h-4 w-4' />
                </span>
              )}
            </Button>
          ))}

          <div
            className='flex-1'
            onDoubleClick={() => {
              console.log('create new file');
              // ! Create new file with unique id on client side
            }}
          />
        </div>
        <ScrollBar orientation='horizontal' className='invisible' />
      </ScrollArea>
    </div>
  );
}
