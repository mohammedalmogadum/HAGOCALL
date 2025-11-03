export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface Chat {
  id:string;
  participant: User;
  messages: Message[];
}