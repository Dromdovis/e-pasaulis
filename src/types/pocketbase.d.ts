declare module 'pocketbase' {
  export default class PocketBase {
    constructor(url: string);
    authStore: {
      isValid: boolean;
      model?: {
        id: string;
        name?: string;
      };
      clear(): void;
      onChange(callback: () => void): void;
    };
    collection(name: string): {
      getOne<T>(id: string, options?: { $cancelKey?: string }): Promise<T>;
      getFirstListItem<T>(filter: string): Promise<T>;
      getList<T>(page?: number, perPage?: number, options?: Record<string, unknown>): Promise<{
        items: T[];
        totalItems: number;
      }>;
      getFullList<T>(options?: {
        batch?: number;
        filter?: string;
        sort?: string;
      }): Promise<T[]>;
      create<T>(data: Record<string, unknown>): Promise<T>;
      update<T>(id: string, data: Record<string, unknown>): Promise<T>;
      delete(id: string): Promise<boolean>;
      authWithPassword(email: string, password: string): Promise<Record<string, unknown>>;
    };
    baseUrl: string;
    cancelRequest(key: string): void;
    autoCancellation(enable: boolean): void;
  }
} 