import { v4 as uuidv4 } from 'uuid';

export class Post {
  id: string;
  createdAt: string;

  constructor(
    public title: string,
    public body: string,
    public tags: string[],
    public authorId: string,
  ) {
    this.id = uuidv4();
    this.createdAt = new Date().toISOString();
  }
}
