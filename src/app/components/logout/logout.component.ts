import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {

  constructor(private userService:UserService, private router:Router){

  }

  public ngOnInit(): void {
    this.logout();
  }  

  public logout(): void{
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
