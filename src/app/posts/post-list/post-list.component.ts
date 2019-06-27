import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../../posts/post.model'
import { PostService } from '../post.service';
import {Subscription} from 'rxjs'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
 
  // posts = [
  //   {
  //     title: 'First Post', content: 'This is the frist post\'s content'
  //   },
  //   {
  //     title: 'Second Post', content: 'This is the Second post\'s content'
  //   },
  //   {
  //     title: 'Third Post', content: 'This is the Third post\'s content'
  //   }
  // ];
  // @Input() posts: Post[] = [];

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postService:PostService) {  
  }

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) =>{
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
   this.postsSub.unsubscribe();
  }

}
