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
      getList<T>(page?: number, perPage?: number, options?: any): Promise<{
        items: T[];
        totalItems: number;
      }>;
      create<T>(data: any): Promise<T>;
      update<T>(id: string, data: any): Promise<T>;
      authWithPassword(email: string, password: string): Promise<any>;
    };
    baseUrl: string;
    cancelRequest(key: string): void;
  }
} 