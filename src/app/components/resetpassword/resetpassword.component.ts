import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css',
})
export class ResetpasswordComponent implements OnInit {
  public resetForm: FormGroup;
  public isResetFormSubmitted: boolean;
  public errorMessage: string;
  public successMessage: string;
  public email: string;
  public passwordsDoNotMatch: boolean;
  public successflag: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.resetForm = {} as FormGroup;
    this.isResetFormSubmitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.passwordsDoNotMatch = false;
    this.successflag = false;
  }

  public ngOnInit(): void {
    this.initializeResetForm();

    // const navigation = this.router.getCurrentNavigation();
    // this.email = navigation?.extras.state?.['email'] || '';
    // console.log("navigation?.extras.state?.['email']:" +navigation?.extras.state?.['email'])
    // if (!this.email) {
    //   alert('Email is missing!');
    //   this.router.navigate(['/forgetpassword']);
    // }

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      if (!this.email) {
         alert('Email is missing!');
         this.router.navigate(['/forgetpassword']);
      }
    });
  }

  public initializeResetForm() {
    this.resetForm = this.formBuilder.group({
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmpass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public get resetFormControls() {
    return this.resetForm.controls;
  }

  public onSubmit(): void {
    this.isResetFormSubmitted = true;
    console.log('On Click of RESET button');

    if (this.resetForm.valid) {
      const newPassword = this.resetFormControls['newpassword'].value;
      const confirmPassword = this.resetFormControls['confirmpass'].value;

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        this.passwordsDoNotMatch = true;
        return;
      }

      // Update password for the current email (email was fetched during forget password)
      this.authService.updatePassword(this.email, newPassword).subscribe(
        (response) => {
          this.successflag = true;
          this.successMessage = 'Password updated successfully!';
          this.errorMessage = '';
          // // Reset the form
         this.resetForm.reset();
          Object.keys(this.resetForm.controls).forEach((key) => {
            this.resetForm.get(key)?.setErrors(null); // Clear validation errors
          });
          this.isResetFormSubmitted = false;

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
