'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { FileIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { PROJECT_FILES } from './constants';
import { SearchMatch, SearchOptions } from './editorSideMenu';

export function SearchPanel() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [replaceQuery, setReplaceQuery] = React.useState('');
  const [showReplace, setShowReplace] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchMatch[]>([]);
  const [searchOptions, setSearchOptions] = React.useState<SearchOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    includePattern: '',
    excludePattern: '',
  });

  const searchFiles = React.useCallback(
    (query: string, options: SearchOptions) => {
      if (!query.trim()) return [];

      const results: SearchMatch[] = [];
      const searchPattern = options.regex
        ? new RegExp(query, options.caseSensitive ? 'g' : 'gi')
        : options.wholeWord
        ? new RegExp(`\\b${query}\\b`, options.caseSensitive ? 'g' : 'gi')
        : new RegExp(query, options.caseSensitive ? 'g' : 'gi');

      const searchInTree = (tree: any, path: string = '') => {
        Object.entries(tree).forEach(([key, value]) => {
          const currentPath = path ? `${path}/${key}` : key;
          if (typeof value === 'object') {
            searchInTree(value, currentPath);
          } else if (searchPattern.test(key)) {
            // Simulate finding matches in file content
            results.push({
              file: currentPath,
              line: 1,
              content: `export function ${key.replace(/\..+$/, '')}() { ... }`,
            });
          }
        });
      };

      try {
        searchInTree(PROJECT_FILES);
      } catch (error) {
        console.error('Invalid regex:', error);
      }

      return results;
    },
    []
  );

  const handleSearch = React.useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSearchResults(searchFiles(query, searchOptions));
    },
    [searchFiles, searchOptions]
  );

  return (
    <div className='flex h-full flex-col'>
      <div className='flex flex-col gap-2 p-2'>
        <div className='flex items-center gap-1'>
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search'
            className='h-7 bg-zinc-800/50 px-2'
          />
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 shrink-0'
            onClick={() => setShowReplace(!showReplace)}
          >
            {showReplace ? (
              <XIcon className='h-4 w-4' />
            ) : (
              <span className='text-xs'>⌥</span>
            )}
          </Button>
        </div>

        {showReplace && (
          <Input
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            placeholder='Replace'
            className='h-7 bg-zinc-800/50 px-2'
          />
        )}

        <div className='flex flex-wrap gap-1'>
          <Toggle
            size='sm'
            pressed={searchOptions.caseSensitive}
            onPressedChange={(pressed) =>
              setSearchOptions((prev) => ({ ...prev, caseSensitive: pressed }))
            }
            aria-label='Match Case'
          >
            Aa
          </Toggle>
          <Toggle
            size='sm'
            pressed={searchOptions.wholeWord}
            onPressedChange={(pressed) =>
              setSearchOptions((prev) => ({ ...prev, wholeWord: pressed }))
            }
            aria-label='Match Whole Word'
          >
            Ab
          </Toggle>
          <Toggle
            size='sm'
            pressed={searchOptions.regex}
            onPressedChange={(pressed) =>
              setSearchOptions((prev) => ({ ...prev, regex: pressed }))
            }
            aria-label='Use Regular Expression'
          >
            .*
          </Toggle>
        </div>

        <div className='space-y-2'>
          <Input
            value={searchOptions.includePattern}
            onChange={(e) =>
              setSearchOptions((prev) => ({
                ...prev,
                includePattern: e.target.value,
              }))
            }
            placeholder='files to include...'
            className='h-7 bg-zinc-800/50 px-2'
          />
          <Input
            value={searchOptions.excludePattern}
            onChange={(e) =>
              setSearchOptions((prev) => ({
                ...prev,
                excludePattern: e.target.value,
              }))
            }
            placeholder='files to exclude...'
            className='h-7 bg-zinc-800/50 px-2'
          />
        </div>
      </div>

      <Separator />

      <ScrollArea className='flex-1'>
        <div className='p-2'>
          {searchResults.length > 0 ? (
            <div className='space-y-4'>
              {searchResults.map((result, i) => (
                <div key={`${result.file}-${i}`} className='space-y-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-full justify-start px-2 hover:bg-zinc-800'
                  >
                    <FileIcon className='mr-2 h-4 w-4' />
                    <span className='truncate'>{result.file}</span>
                  </Button>
                  <div className='ml-6 border-l-2 border-zinc-800 pl-4'>
                    <pre className='text-xs'>
                      <span className='mr-2 text-zinc-500'>{result.line}</span>
                      <span>{result.content}</span>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className='p-4 text-center text-sm text-zinc-500'>
              No results found
            </div>
          ) : (
            <div className='p-4 text-center text-sm text-zinc-500'>
              Type to search in project
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
