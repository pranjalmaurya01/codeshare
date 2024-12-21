'use client';

import { getYjsDoc, syncedStore } from '@syncedstore/core';
import { WebsocketProvider } from 'y-websocket';

// Create your SyncedStore store
// We create a store which contains an array (myArray) and an object (myObject)
export const store = syncedStore({ doc: 'text' });

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsDoc(store);

export const provider = new WebsocketProvider(
  process.env.NEXT_PUBLIC_SIGNALING_WEBSOCKET_SERVER!,
  'codemirror6-demo-room-new',
  doc
);

export const awareness = provider.awareness;
