import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import {Post} from '../../posts/post.model'
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO Content';
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId: string;
  isLoading = false;
  post: Post;
  // @Output() postCreated = new EventEmitter();
  constructor(public postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
         this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
        });
      }
        else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onSavePost(from: NgForm) {

      // this.newPost = postInput.value;
      if (from.invalid) {
        return true;
      }
    //  const post: Post = {
    //    title: from.value.title,
    //    content: from.value.content
    //  };
    //  this.postCreated.emit(post);
      if (this.mode === 'create') {
        this.postService.addPost(from.value.title, from.value.content);
    } else {
       this.postService.updatePost(this.postId,from.value.title, from.value.content);
    }
      from.resetForm();
  }

}
