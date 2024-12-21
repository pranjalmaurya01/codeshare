'use client';

import { type LucideIcon } from 'lucide-react';

export interface SidebarIcon {
  name: string;
  icon: LucideIcon;
  label: string;
}

export interface FileStructure {
  [key: string]: string | FileStructure;
}

export interface SearchMatch {
  file: string;
  line: number;
  content: string;
}

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  includePattern: string;
  excludePattern: string;
}

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { HTMLAttributes, useState } from 'react';
import { SIDEBAR_ICONS } from './constants';
import { FileExplorer } from './fileExplorer';
import { SearchPanel } from './searchPanel';

type SidebarProps = HTMLAttributes<HTMLDivElement>;

export function EditorSidebar({ className }: SidebarProps) {
  const [activeIcon, setActiveIcon] = useState<string>('files');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleIconClick = (name: string) => {
    if (activeIcon === name) {
      setIsExpanded(!isExpanded);
    } else {
      setActiveIcon(name);
      setIsExpanded(true);
    }
  };

  return (
    <div className={cn('flex', className)}>
      <div
        className={cn('flex w-16 flex-col items-center border-r  text-white')}
      >
        <TooltipProvider>
          {SIDEBAR_ICONS.map(({ name, icon: Icon, label }) => (
            <Tooltip key={name} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  className={cn(
                    'relative h-16 w-16 rounded-none',
                    activeIcon === name &&
                      ' before:absolute before:left-0 before:h-6 before:w-[2px] before:bg-blue-500'
                  )}
                  onClick={() => handleIconClick(name)}
                >
                  <Icon className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right'>{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      {isExpanded && (
        <div className='w-64 transition-all duration-300 ease-in-out'>
          <div className='h-full '>
            {activeIcon === 'files' && (
              <FileExplorer onToggle={() => setIsExpanded(false)} />
            )}
            {activeIcon === 'search' && <SearchPanel />}
          </div>
        </div>
      )}
    </div>
  );
}
