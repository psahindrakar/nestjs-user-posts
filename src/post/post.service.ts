import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as fs from 'fs';

import { User } from 'src/user/user.model';
import { Post } from './post.model';

@Injectable()
export class PostService {
  createPost(title: string, body: string, tags: string[], authorId: string) {
    const db = this.readLocalDb();
    const existingUser = db.posts.find(
      (post) => post.authorId === authorId && post.title === title,
    );
    if (existingUser) {
      throw new NotAcceptableException(
        'Post with given authorId and title already exists',
      );
    }
    const createdPost = new Post(title, body, tags, authorId);
    db.posts.push(createdPost);
    this.writeLocalDb(db);
    return createdPost;
  }
  
  getPosts(authorId: string) {
    const db = this.readLocalDb();
    if (authorId) {
      return db.posts.filter((post) => post.authorId === authorId);
    }
    return db.posts;
  }

  getPost(postId: string) {
    const db = this.readLocalDb();
    const [post] = db.posts.filter((post) => post.id === postId);
    return post;
  }

  private readLocalDb() {
    const db: { users: User[]; posts: Post[] } = JSON.parse(
      fs.readFileSync('./db.json', 'utf-8'),
    );
    return db;
  }

  private writeLocalDb(db) {
    fs.writeFileSync('./db.json', JSON.stringify(db));
  }
}
