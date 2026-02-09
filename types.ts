
export type AppStep = 'password' | 'landing' | 'memories' | 'message' | 'question' | 'success';

export interface Memory {
  url: string;
  caption: string;
}
