import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../../posts/post.model'
import { PostService } from '../post.service';
import {Subscription} from 'rxjs'
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  public userIsAuthenticated;
  isLoading = false;
  totalPost = 0;
  postPerPage = 2;
  pageSizeOption = [1, 2, 5, 10];
  currentPage = 1;
  userId: string;
  constructor(public postService: PostService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postService.getPostUpdateListener()
    .subscribe((postsData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPost = postsData.postCount;
      this.posts = postsData.posts;

    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub =  this.authService
    .getAuthStatusListner()
    .subscribe(isAuthenticated => {
       this.userIsAuthenticated = isAuthenticated;
       this.userId = this.authService.getUserId();
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
    }, () => {
       this.isLoading = false;
    });
  }

  ngOnDestroy() {
  //  this.postsSub.unsubscribe();
   this.authStatusSub.unsubscribe();
  }

}
