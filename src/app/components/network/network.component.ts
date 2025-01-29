import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrl: './network.component.css',
})
export class NetworkComponent implements OnInit {
  public user: any;
  public allUserDetails: any[];
  public userId: number;
  public filteredDetails: any[];

  constructor(private userService: UserService,private changeDetectorRef: ChangeDetectorRef) {
    this.user = {};
    this.userId = 0;
    this.allUserDetails = [];
    this.filteredDetails = [];
  }

  public ngOnInit(): void {
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
  
        // Exclude the logged-in user
        this.filteredDetails = this.allUserDetails
          .filter((users) => users.id !== this.userId.toString())
          .map((user) => {
            const isPending = this.user.userConnectionReq.some(
              (req: any) => req.id.toString() === user.id.toString()
            );
            
            const isFriend = this.user.acceptedUserFriends.some(
              (friend: any) => friend.id.toString() === user.id.toString()
            );
            const isRequesting = user.userConnectionReq.some(
              (req: any) => req.id.toString() === this.user.id.toString()
            );
  
            return {
              ...user,
              status: isFriend
                ? 'Friend'
                : isPending
                ? 'Pending'
              //  : isRequesting
               // ? 'Request awaiting your approval'
                : 'Send Request',
            };
          });
  
        console.log('Filtered Details:', this.filteredDetails);
      },
      error: (error) => {
        console.error('Error fetching all user details:', error);
      },
    });
  }
  

  public handleRequest(targetUser: any): void {
    // Check if the request already exists in the receiver's userConnectionReq
    if (!Array.isArray(targetUser.userConnectionReq)) {
      targetUser.userConnectionReq = [];
    }
  
    const requestExists = targetUser.userConnectionReq.some(
      (req: any) => req.id === this.user.id
    );
  
    if (requestExists) {
      alert('Friend request already sent to this user.');
      return;
    }
  
    // Add the request to the receiver's userConnectionReq
    targetUser.userConnectionReq.push({
      id: this.user.id,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
    });
  

    // Update the receiver's data in the backend
    this.userService.updateUserProfile(targetUser.id, {
      userConnectionReq: targetUser.userConnectionReq,
    }).subscribe({
      next: () => {
        console.log('Friend request sent and updated for the receiver.');
        targetUser.status = 'Pending'; // Update UI locally for feedback
      },
      error: (error) => {
        console.error('Error updating receiver data:', error);
      },
    });
  }  
   
  public acceptRequest(requestingUser: any): void {
    // Ensure arrays are initialized
    if (!Array.isArray(this.user.userConnectionReq)) {
      this.user.userConnectionReq = [];
    }
    if (!Array.isArray(this.user.acceptedUserFriends)) {
      this.user.acceptedUserFriends = [];
    }
    if (!Array.isArray(requestingUser.userConnectionReq)) {
      requestingUser.userConnectionReq = [];
    }
    if (!Array.isArray(requestingUser.acceptedUserFriends)) {
      requestingUser.acceptedUserFriends = [];
    }
  
    // Remove the request from userConnectionReq
    this.user.userConnectionReq = this.user.userConnectionReq.filter(
      (req: any) => req.id !== requestingUser.id
    );
  
    // Add the requesting user to acceptedUserFriends
    this.user.acceptedUserFriends.push({
      id: requestingUser.id,
      firstName: requestingUser.firstName,
      lastName: requestingUser.lastName,
    });
  
    // Update the current user's data in the backend
    this.userService.updateUserProfile(this.user.id, {
      userConnectionReq: this.user.userConnectionReq,
      acceptedUserFriends: this.user.acceptedUserFriends,
    }).subscribe({
      next: () => {
        console.log('Request accepted and user data updated for current user.');
  
        // Fetch the full details of the requesting user (from the backend)
        this.userService.getUserDetails(requestingUser.id).subscribe({
          next: (fullRequestingUser) => {
            // Add current user to the requesting user's acceptedUserFriends
            fullRequestingUser.acceptedUserFriends.push({
              id: this.user.id,
              firstName: this.user.firstName,
              lastName: this.user.lastName,
            });
  
            // Remove the current user from requesting user's userConnectionReq
            fullRequestingUser.userConnectionReq = fullRequestingUser.userConnectionReq.filter(
              (req: any) => req.id !== this.user.id
            );
  
            // Update the requesting user's data in the backend
            this.userService.updateUserProfile(requestingUser.id, {
              userConnectionReq: fullRequestingUser.userConnectionReq,
              acceptedUserFriends: fullRequestingUser.acceptedUserFriends,
            }).subscribe({
              next: () => {
                console.log('Request accepted and user data updated for requesting user.');
                requestingUser.status = 'Friend'; // Update UI
                // Manually update the status of the requesting user in filteredDetails
                const index = this.filteredDetails.findIndex((user: any) => user.id === requestingUser.id);
                if (index !== -1) {
                  this.filteredDetails[index].status = 'Friend';
                }

                // Optionally, trigger change detection
                this.changeDetectorRef.detectChanges();
              },
              error: (error) => {
                console.error('Error updating requesting user data:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error fetching requesting user details:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error updating current user data:', error);
      },
    });
  }
  
  

}
