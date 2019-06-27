import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import {Post} from '../../posts/post.model'
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO Content';
  enteredContent = '';
  enteredTitle = '';
  // @Output() postCreated = new EventEmitter();
  constructor(public postService:PostService) { }

  ngOnInit() {
  }
  onAddPost(from: NgForm) {

      // this.newPost = postInput.value;
      if(from.invalid){
        return true;
      }
    //  const post: Post = {
    //    title: from.value.title,
    //    content: from.value.content
    //  };
    //  this.postCreated.emit(post);

    this.postService.addPost(from.value.title,from.value.content);
    from.resetForm();
  }

}
