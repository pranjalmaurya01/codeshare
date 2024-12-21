'use client';

import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

// Create your SyncedStore store
export const mainYDoc = new Doc();

export const provider = new WebsocketProvider(
  process.env.NEXT_PUBLIC_SIGNALING_WEBSOCKET_SERVER!,
  'codemirror6-demo-room-new',
  mainYDoc
);

export const awareness = provider.awareness;
