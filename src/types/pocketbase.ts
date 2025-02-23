import type { SendOptions } from 'pocketbase';

export interface PocketBaseOptions extends SendOptions {
  requestKey?: string | null;
  $cancelKey?: string;
}

export interface PBUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  created: string;
  updated: string;
  verified: boolean;
  emailVisibility: boolean;
} 