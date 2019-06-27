import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import {Post} from '../../posts/post.model'
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO Content';
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onAddPost(from: NgForm) {

      // this.newPost = postInput.value;
      if(from.invalid){
        return true;
      }
     const post: Post = {
       title: from.value.title,
       content: from.value.content
     };
     this.postCreated.emit(post);

  }

}
