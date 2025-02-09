"use client";

import pako from 'pako';

export const compressData = (data: any): string => {
  const stringData = JSON.stringify(data);
  const compressed = pako.deflate(stringData);
  return btoa(String.fromCharCode.apply(null, compressed as any));
};

export const decompressData = (compressed: string): any => {
  const binary = atob(compressed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decompressed = pako.inflate(bytes, { to: 'string' });
  return JSON.parse(decompressed);
};
