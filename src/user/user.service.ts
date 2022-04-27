import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as fs from 'fs';
import { Post } from 'src/post/post.model';
import { User } from './user.model';

@Injectable()
export class UserService {
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
}
