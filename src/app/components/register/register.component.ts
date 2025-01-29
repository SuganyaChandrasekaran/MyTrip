import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  public userForm: FormGroup;
  public isUserFormSubmitted: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = {} as FormGroup;
    this.isUserFormSubmitted = false;
  }

  public ngOnInit(): void {
    this.initializeUserForm();
  }

  public initializeUserForm() {
    this.userForm = this.formBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get userFormControls() {
    return this.userForm.controls;
  }

  public onSubmit(): void {
    this.isUserFormSubmitted = true;

    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe({
        next: (response) => {
          console.log('User added successfully:', response);
          alert('User registered successfully. Kindly do the login!');

          this.userForm.reset(); // Clear the form
          this.isUserFormSubmitted = false; // Reset the form submission flag
        },
        error: (err) => {
          console.error('Error adding user:', err);
        },
      });
    }
  }
}
