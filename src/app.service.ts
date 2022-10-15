import { Injectable, Post, Request } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Service Up and Running!';
  }
}
