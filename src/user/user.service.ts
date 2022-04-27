import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import * as fs from 'fs';

import { Post } from 'src/post/post.model';
import { User } from './user.model';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  // Runs every 45 sec. This is for trial.
  @Cron('30 * * * * *')
  removeInactiveUsers(): void {
    this.logger.debug('Triggered removeOveractiveUserPosts');
    const db = this.readLocalDb();
    const oldUsers = this.getOldUsers(db);
    this.logger.debug('Old users: ', JSON.stringify(oldUsers));
    const inactiveUsers = oldUsers.filter((user) => {
      const userPosts = db.posts.filter((post) => post.authorId === user.id);
      return userPosts.length === 0;
    });
    const inactiveUserIds = inactiveUsers.map((user) => user.id);
    this.logger.debug('Inactive userIds: ', inactiveUserIds);
    db.users = db.users.filter((user) => !inactiveUserIds.includes(user.id));
    this.writeLocalDb(db);
  }

  // Helps create the db.json locally, which can be then pushed to github.
  // The GET user and GET users API will get this data from the faked API endpoint
  createUser(firstname: string, lastname: string): User {
    const db = this.readLocalDb();

    const existingUser = db.users.find(
      (user) => user.firstname === firstname && user.lastname === lastname,
    );
    if (existingUser) {
      throw new NotAcceptableException(
        'User with given firstname and lastname already exists',
      );
    }
    const createdUser = new User(firstname, lastname);
    db.users.push(createdUser);
    this.writeLocalDb(db);
    return createdUser;
  }

  getUsers() {
    const db = this.readLocalDb();
    return db.users;
  }

  getUser(userId: string) {
    const db = this.readLocalDb();
    const [user] = db.users.filter((user) => user.id === userId);
    return user;
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

  private getOldUsers(db): User[] {
    const users = db.users;
    return users.filter((user) => {
      const now = moment(new Date());
      const end = moment(user.createdAt);
      const duration = moment.duration(now.diff(end));
      const mins = duration.asMinutes();
      return mins > 10;
    });
  }
}
