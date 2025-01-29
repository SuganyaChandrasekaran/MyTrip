import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css',
})
export class ChangepasswordComponent implements OnInit {
  public changeForm: FormGroup;
  public isChangeFormSubmitted: boolean;
  public errorMessage: string;
  public successMessage: string;
  public passwordsDoNotMatch: boolean;
  public userId: number;
  public successflag: boolean;

  constructor(
    public formBuilder: FormBuilder, 
    private router: Router,
    public userService:UserService
  ) {
    this.changeForm = {} as FormGroup;
    this.isChangeFormSubmitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordsDoNotMatch = false;
    this.userId = 0;
    this.successflag = false;
  }

  public ngOnInit(): void {

    this.userId = parseInt(localStorage.getItem('userId') ?? '0', 10); // Default to '0' if null
    this.initializeChangeForm();
  }

  public initializeChangeForm() {
    this.changeForm = this.formBuilder.group({
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmpass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get changeFormControls() {
    return this.changeForm.controls;
  }

  public onSubmit(): void {
    this.isChangeFormSubmitted = true;

    if (this.changeForm.valid) {
      const newPassword = this.changeFormControls['newpassword'].value;
      const confirmPassword = this.changeFormControls['confirmpass'].value;

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        this.passwordsDoNotMatch = true;
        return;
      }

      const updatedDetails = {
        password: newPassword
      }
      // Update password for the current email (email was fetched during forget password)
      this.userService.updateUserProfile(this.userId.toString(), updatedDetails).subscribe(
        (response) => {
          this.successflag = true;
          this.successMessage = 'Password updated successfully!';
          this.errorMessage = '';
          // // Reset the form
         this.changeForm.reset();
          Object.keys(this.changeForm.controls).forEach((key) => {
            this.changeForm.get(key)?.setErrors(null); // Clear validation errors
          });
          this.isChangeFormSubmitted = false;

          // Automatically clear the success message after a delay
          setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        },
        (error) => {
          this.errorMessage =
            'Failed to update the password. Please try again.';
            this.successMessage = '';
        }
      );

    }
  }
}
