import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import moment from 'moment';

import { User } from 'src/user/user.model';
import { Post } from './post.model';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  // Runs every 45 sec. This is for trial.
  @Cron('59 * * * * *')
  removeOveractiveUserPosts(): void {
    this.logger.debug('Triggered removeOveractiveUserPosts');
    const db = this.readLocalDb();
    const userPostMap: Record<string, string[]> = db.posts.reduce(
      (accu, post) => {
        if (accu[post.authorId]) {
          accu[post.authorId].push(post.id);
        } else {
          accu[post.authorId] = [post.id];
        }
        return accu;
      },
      {},
    );
    let tobeDeletedPostIds = [];
    Object.keys(userPostMap).forEach((userId) => {
      // If user has 5 or more posts then delete all those posts
      if (userPostMap[userId].length > 4) {
        tobeDeletedPostIds = tobeDeletedPostIds.concat(userPostMap[userId]);
      }
    });
    this.logger.debug('Posts to be deleted: ', tobeDeletedPostIds);
    db.posts = db.posts.filter((post) => !tobeDeletedPostIds.includes(post.id));
    this.writeLocalDb(db);
  }

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
