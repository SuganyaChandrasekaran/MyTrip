import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
})
export class ManageUserComponent implements OnInit {
  public userPosts: any[] = []; // Declare userPosts property
  public user: any;
  public newPostContent: string = '';
  public userId:number;

  constructor(private route: ActivatedRoute,private userService:UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.userId=0;
  }

  ngOnInit(): void {
    this.userId = parseInt(this.route.snapshot.paramMap.get('id')?? '0', 10);
    console.log('User ID:', this.userId);

    // // Mock user data - Replace this with data from a service
    // const users = [
    //   {
    //     id: '1',
    //     firstName: 'Suganya',
    //     lastName: 'Chandrasekaran',
    //     email: 'suganya@example.com',
    //     phoneNo: '9086462626',
    //     dob: '1989-09-26',
    //     username: 'sugan',
    //     role: 'Admin',
    //     country: 'India',
    //     state: 'Tamil Nadu',
    //     profileStatus: 'active',
    //     password: '12345678',
    //     userProfileImageUrl: 'https://via.placeholder.com/150',
    //     userPost: [
    //       { id: 101, content: 'Good Morning!', uploadTime: '2024-12-01T05:14:09' },
    //       { id: 102, content: 'Welcome to FBook!', uploadTime: '2024-12-01T05:14:48' },
    //     ],
    //     gender: 'Female',
    //   },
    // ];
    this.getUserDetails();
  }

  public getUserDetails(): void {
    this.userService.getUserDetails(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        console.log('User Details:', this.user);
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  toggleProfileStatus(): void {
    if (this.user) {
      const newStatus = this.user.profileStatus === 'active' ? 'blocked' : 'active';
      this.userService.updateUserProfile(this.user.id, { profileStatus: newStatus }).subscribe(
        (updatedUser) => {
          this.user.profileStatus = updatedUser.profileStatus; // Update the UI
          console.log('User profile status updated successfully:', updatedUser);
        },
        (error) => {
          console.error('Error updating user profile status:', error);
        }
      );
    }
  }
  
  resetPassword(): void {
    if (this.user) {
      const newPassword = prompt('Enter new password for the user:'); // Or generate a random password
      if (newPassword) {
        this.userService.resetPassword(this.user.id, newPassword).subscribe(
          (updatedUser) => {
            console.log('Password reset successfully:', updatedUser);
            alert('Password has been reset successfully.');
          },
          (error) => {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.');
          }
        );
      }
    }
  }

  postMessage(): void {
    if (this.newPostContent && this.newPostContent.trim()) {
      const newPost = {
        id: Date.now(), // Use a timestamp as a unique ID
        content: this.newPostContent.trim(),
        uploadTime: new Date().toISOString(),
      };
  
      // Get current posts, add the new post, and update the database
      this.userService.getUserDetails(this.userId).subscribe(
        (user) => {
          const updatedPosts = [...user.userPost, newPost]; // Append the new post
          this.userService.addPostToUser(this.userId, updatedPosts).subscribe(
            (updatedUser) => {
              console.log('Post added successfully:', newPost);
              this.user.userPosts = updatedUser.userPost; // Update the local UI
              this.newPostContent = ''; // Clear the input field
            },
            (error) => {
              console.error('Error updating posts:', error);
              alert('Failed to post the message. Please try again.');
            }
          );
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      alert('Post content cannot be empty!');
    }
  }


  updateProfile(): void {
    this.userService.updateUserProfile(this.user.id, this.user).subscribe(
      (updatedUser) => {
        console.log('Profile updated successfully:', updatedUser);
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    );
  }
  
   // Hide post logic
   hidePost(postId: number): void {
    if (this.userId) {
      this.userService.hidePost(this.userId, postId).subscribe(
        () => {
          this.userPosts = this.userPosts.map((post) =>
            post.id === postId ? { ...post, hidden: true } : post
          );
          console.log(`Post with ID ${postId} has been hidden.`);
        },
        (error) => {
          console.error('Error hiding post:', error);
        }
      );
    }
  }
  
  togglePostVisibility(postId: number, isHidden: boolean): void {
    if (this.userId) {
      this.userService.togglePostVisibility(this.userId, postId, isHidden).subscribe(
        () => {
          this.userPosts = this.userPosts.map((post: any) =>
            post.id === postId ? { ...post, hidden: isHidden } : post
          );
          // Trigger change detection
          this.cdr.markForCheck();

          const action = isHidden ? 'hidden' : 'unhidden';
          alert(`Post with ID ${postId} has been ${action}.`);
        },
        (error) => {
          console.error('Error toggling post visibility:', error);
        }
      );
    }
  }
  
}
