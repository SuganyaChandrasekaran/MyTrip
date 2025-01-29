import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrl: './home2.component.css'
})
export class Home2Component implements OnInit {
  public user:any;
  public posts:any[];
  public newPostContent: string;
  public userId: number

  constructor(private userService:UserService) {
    this.user = {};
    this.posts = [];
    this.newPostContent = "";
    this.userId = 0;
  }

  public ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10); // Default to '0' if null

    this.getUserDetails();
  }

  public getUserDetails(): void{
   this.userService.getUserDetails(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        console.log('User Details:', this.user);

        // Extract user posts directly from the response
        this.posts = this.user.userPost;
        console.log('User Posts:', this.posts);

      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
   })
  }

  public addPost(): void{
    const newPost = {
      id: Date.now(), // Unique ID for the post
      content: this.newPostContent,
      uploadTime: new Date().toLocaleString(),
      };
      const updatedPosts = [...this.user.userPost, newPost];
      this.userService.addPostToUser(this.userId,updatedPosts).subscribe({
        next: (response) => {
          console.log('User Posts:', this.posts);
          this.user.userPost = updatedPosts;
          this.posts.unshift(newPost); 
          this.newPostContent = ''; // Clear input field
          alert("Succesfully post has been saved"); 
        },
        error: (error) => {
          console.error("Error in saving the post:", error);
        }
      })
  }
}
 