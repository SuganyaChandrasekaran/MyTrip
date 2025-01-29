import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl:string;
  private roleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor(private http:HttpClient) { 
    this.apiUrl = 'http://localhost:3000/users';
    // Initialize the role from localStorage if it exists
    const role = localStorage.getItem('role');
    this.roleSubject.next(role);
  }

  // Method to verify email and dob
  public verifyEmailAndDob(email: string, dob: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.dob === dob);
        return !!user; // Return true if user exists, otherwise false
      })
    );
  }

  // Update the password for a given email
  public updatePassword(email:string, newpassword:string): Observable<any>{
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.email === email);
        if(user) {
          const updatedUser = { ...user, password: newpassword  };
          return this.http.put(`${this.apiUrl}/${user.id}`, updatedUser). subscribe();
        } else {
          throw new Error('User not found');
        }
      })
    );
  }

  // Observable for components to subscribe
  getRole(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  // Synchronous role value
  getCurrentRole(): string | null {
    return this.roleSubject.getValue();
  }

  // Utility to check if user is admin
  isAdmin(): boolean {
    return this.getCurrentRole() === 'Admin';
  }

}
