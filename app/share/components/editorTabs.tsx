'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface TabState {
  id: string;
  label: string;
}

interface EditorTabsProps {
  tabs: TabState[];
  activeTab?: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewFileCreate: () => void;
}

export function EditorTabs({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onNewFileCreate,
}: EditorTabsProps) {
  return (
    <div className={cn('border-b border-zinc-800 bg-black/90 text-white')}>
      <ScrollArea className='w-full' type='scroll'>
        <div className='flex h-8'>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant='ghost'
              size='sm'
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'group h-8 rounded-none border-r border-zinc-800 flex items-center justify-end hover:text-white',
                activeTab === tab.id && '!bg-black/50'
              )}
            >
              <span className='max-w-[160px] truncate text-sm'>
                {tab.label}
              </span>

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
            </Button>
          ))}

          <div
            className='flex-1 cursor-pointer'
            onDoubleClick={() => {
              onNewFileCreate();
            }}
          />
        </div>
        <ScrollBar orientation='horizontal' className='invisible' />
      </ScrollArea>
    </div>
  );
}
