import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  createdAt: string;

  constructor(public firstname: string, public lastname: string) {
    this.id = uuidv4();
    this.createdAt = new Date().toISOString();
  }
}
