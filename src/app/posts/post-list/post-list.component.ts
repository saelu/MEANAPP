import { Component,Input, OnInit } from '@angular/core';
import {Post} from '../../posts/post.model'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
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
  @Input() posts: Post[] = [];

  constructor() { }

  ngOnInit() {
  }

}
