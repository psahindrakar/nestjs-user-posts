import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Called hellow API')
    return 'Hello World!';
  }
}
