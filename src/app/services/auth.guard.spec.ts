import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, UserService, Router],
    });

    authGuard = TestBed.inject(AuthGuard);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  // Add other tests for canActivate behavior
});
