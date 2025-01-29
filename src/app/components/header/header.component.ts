import { Component, isStandalone, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  public isLoggedIn: boolean;
  private subscription!: Subscription;
  public  isAdmin: boolean;
  private roleSubscription: Subscription | null = null;

  constructor(private userService: UserService, 
    private authService:AuthService,
    private cdr: ChangeDetectorRef)
    {
    this.isLoggedIn = false;
    this.isAdmin = false;
  }

  public ngOnInit(): void {
    this.subscription = this.userService.isLoggedIn$.subscribe(
      (status) =>  {
        this.isLoggedIn = status;
        this.cdr.detectChanges(); // Trigger change detection
      }
    );

     // Initialize admin status
  const role = localStorage.getItem('role'); // Retrieve role from localStorage
  this.isAdmin = role === 'Admin';
  
    // Subscribe to role changes
    this.roleSubscription = this.authService.getRole().subscribe((role) => {
      this.isAdmin = role === 'Admin';
      this.cdr.detectChanges(); // Trigger change detectionyz
      console.log("isAdmin:",this.isAdmin);
    });
  }

  public ngOnDestroy(): void {
    // Clean up subscription
    this.subscription.unsubscribe();
    this.roleSubscription?.unsubscribe(); // Cleanup role subscription
  }

  public logout(): void {
    this.userService.logout();
  }

}
