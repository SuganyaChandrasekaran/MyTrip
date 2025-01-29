import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isLoginFormSubmitted: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = {} as FormGroup;
    this.isLoginFormSubmitted = false;
  }

  public ngOnInit(): void {
    this.initializeLoginForm();
  }

  public initializeLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get loginFormControls() {
    return this.loginForm.controls;
  }

  public onSubmit(): void {
    this.isLoginFormSubmitted = true;

    if (this.loginForm.invalid) {
      return; // Stop if the form is invalid
    }

    const loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.userService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Inside the login method after user is found:
        localStorage.setItem('userId', response.id);  // Store userId in localStorage (use 'user.id' or whatever property is applicable)
        localStorage.setItem('role', response.role);
        this.userService.saveToken(response.token); // Save JWT in localStorage
        this.router.navigate(['/home']); // Navigate to home page
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Invalid username or password');
      },
    });
  }
}
