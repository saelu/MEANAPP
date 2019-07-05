import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../../posts/post.model'
import { PostService } from '../post.service';
import {Subscription} from 'rxjs'
import { PageEvent } from '@angular/material';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPost = 0;
  postPerPage = 2;
  pageSizeOption = [1, 2, 5, 10];
  currentPage = 1;
  constructor(public postService: PostService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postService.getPostUpdateListener()
    .subscribe((postsData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPost = postsData.postCount;
      this.posts = postsData.posts;

    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }
  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  // ngOnDestroy(): void {
  //  this.postsSub.unsubscribe();
  // }

}
