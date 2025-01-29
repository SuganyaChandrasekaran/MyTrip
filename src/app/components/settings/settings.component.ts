import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  public userId: number;
  public user: any;

  constructor (private userService:UserService){
      this.userId = 0;
      this.user = {};
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
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  public saveProfile(): void{
    const updatedDetails = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      gender: this.user.gender,
      dob: this.user.dob,
      email: this.user.email,
      phoneNo: this.user.phoneNo,
      country: this.user.country,
      state: this.user.state,
    };

    this.userService.updateUserProfile(this.user.id, updatedDetails).subscribe(
      (response) => {
        alert('Profile updated successfully!');
        console.log('Updated user profile:', response);
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
