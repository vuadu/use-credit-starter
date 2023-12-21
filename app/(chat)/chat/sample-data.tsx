import { ChatSession } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const CHAT_SESSIONS: ChatSession[] = [
  {
    id: uuidv4(),
    name: 'How to get started with the API?',
    createdAt: new Date('2023-12-08T12:00:00Z'),
    updatedAt: new Date('2023-12-08T15:00:00Z')
  },
  {
    id: uuidv4(),
    name: 'Best cake recipes',
    createdAt: new Date('2023-12-13T12:00:00Z'),
    updatedAt: new Date('2023-12-14T15:00:00Z')
  },
  {
    id: uuidv4(),
    name: 'Create a new homepage',
    createdAt: new Date('2023-12-15T12:00:00Z'),
    updatedAt: new Date('2023-12-17T15:00:00Z')
  },
  {
    id: uuidv4(),
    name: 'Best movie for the weekend',
    createdAt: new Date('2023-12-15T12:00:00Z'),
    updatedAt: new Date('2023-12-15T15:00:00Z')
  },
  {
    id: uuidv4(),
    name: 'Home decoration ideas',
    createdAt: new Date('2023-12-19T12:00:00Z'),
    updatedAt: new Date('2023-12-19T15:00:00Z')
  },
  {
    id: uuidv4(),
    name: 'PlayStation 5 or Xbox Series X?',
    createdAt: new Date('2023-12-20T12:00:00Z'),
    updatedAt: new Date('2023-12-20T15:00:00Z')
  }
];
