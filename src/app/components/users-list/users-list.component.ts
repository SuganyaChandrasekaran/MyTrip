import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent implements OnInit {
  public user: any;
  public userId: number;
  public allUserDetails: any[];

  constructor(private userService: UserService, private  router:Router) {
    this.user = {};
    this.userId = 0;
    this.allUserDetails = [];
  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10); // Default to '0' if null
    this.getUserDetails();
    this.getAllUsers();

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

  public getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.allUserDetails = response;
      },
      error: (error) => {
        console.error('Error fetching all user details:', error);
      },
    });
  }

  public navigateToManageUser(userId: number): void {
    this.router.navigate(['/manageuser',userId]); // Navigate to the Manage Users page with userId
  }

}
