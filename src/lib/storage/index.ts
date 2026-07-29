import type { IStorageService } from './storage.interface';
import { LocalStorageProvider } from './local-storage.provider';

let storageInstance: IStorageService | null = null;

export function getStorageService(): IStorageService {
  if (!storageInstance) {
    storageInstance = new LocalStorageProvider();
  }
  return storageInstance;
}

export * from './storage.interface';
export * from './local-storage.provider';
