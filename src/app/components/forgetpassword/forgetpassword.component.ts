import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css',
})
export class ForgetpasswordComponent implements OnInit {
  public forgetForm: FormGroup;
  public isforgerFormSubmitted: boolean;
  public errorMessage: string;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgetForm = {} as FormGroup;
    this.isforgerFormSubmitted = false;
    this.errorMessage = "";
  }

  public ngOnInit(): void {
    this.initializeForgetForm();
  }

  public initializeForgetForm(): void {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required]],
    });
  }

  public get forgetFormControls() {
    return this.forgetForm.controls;
  }

  public onSubmit(): void {
    this.isforgerFormSubmitted = true;
    console.log('Forget password values are entered');

    if(this.forgetForm.valid){
      const { email, dob } = this.forgetForm.value;

      this.authService.verifyEmailAndDob(email, dob).subscribe((isValid) =>{
        if(isValid){
          this.router.navigate(['/resetpassword'], { queryParams: { email } });
        } else {
          this.errorMessage = 'Invalid email or date of birth. Please try again.';
        }
      })
    }
  }
}
