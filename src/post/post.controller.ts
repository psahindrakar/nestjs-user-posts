import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('tags') tags: string[],
    @Body('authorId') authorId: string,
  ) {
    return this.postService.createPost(title, body, tags, authorId);
  }

  @Get()
  getPosts(@Query('authorId') authorId: string) {
    return this.postService.getPosts(authorId);
  }

  @Get(':postId')
  getPost(@Param('postId') postId: string) {
    return this.postService.getPost(postId);
  }
}
