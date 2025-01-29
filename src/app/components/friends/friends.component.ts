import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit{

  public userId: number;
  public user: any;
  public acceptedUserFriends: any;

  constructor(private userService:UserService ){
    this.userId = 0;
    this.user = {};
    this.acceptedUserFriends = {};
  }

  public ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10); // Default to '0' if null
    this.getUserDetails();
  }

  public getUserDetails(): void {
    this.userService.getUserDetails(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        this.acceptedUserFriends = response.acceptedUserFriends;
        console.log('User Details:', this.user);
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }


}
