import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import {Post} from '../../posts/post.model'
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from './mime-type.validator';
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
  form: FormGroup;
  private postId: string;
  isLoading = false;
  post: Post;
  imagePreview: string;
  // @Output() postCreated = new EventEmitter();
  constructor(public postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
       title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
        }),
       content: new FormControl(null, 
        {validators: [Validators.required] }),
       image: new FormControl(null, {validators: [Validators.required],
         asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
         this.isLoading = false;
         this.post = {
           id: postData._id,
           title: postData.title,
           content: postData.content,
           imagePath: postData.imagePath
          };
         this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      }
        else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
     const file = (event.target as HTMLInputElement).files[0];
     this.form.patchValue({image: file});
     this.form.get('image').updateValueAndValidity();
     const reader = new FileReader();
     reader.onload = () =>{
       this.imagePreview = reader.result as string;
     }
      reader.readAsDataURL(file);
  }
  onSavePost() {

      // this.newPost = postInput.value;
      if (this.form.invalid) {
        return true;
      }
    //  const post: Post = {
    //    title: from.value.title,
    //    content: from.value.content
    //  };
    //  this.postCreated.emit(post);
      if (this.mode === 'create') {
        this.postService.addPost(
           this.form.value.title,
           this.form.value.content,
           this.form.value.image
           );
    } else {
      console.log("======================================== post create " + this.postId + "  "+ + this.form.value.title + "  "+ + this.form.value.content +"  " +this.form.value.image)
       this.postService.updatePost(
         this.postId,
         this.form.value.title,
        this.form.value.content,
        this.form.value.image , 
       
          );

    }
      this.form.reset();
  }

}
