import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = ''; 
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor(private http:HttpClient) {
    this.apiUrl = 'http://localhost:3000/users';
   }

  // Check if a token exists
  public hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Observable to watch login state
  isLoggedIn$ = this.loggedIn.asObservable();

  public addUser(user: IUser): Observable<IUser>{
    console.log ('Inside add user');
    return this.http.post<IUser>(this.apiUrl,user);
  }

  public login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find(
          (user) =>
            user.email === credentials.username && user.password === credentials.password
        );
        if (!user) {
          throw new Error('Invalid username or password');
        }
        // Here, you can create a JWT or generate a mock token
        const mockToken = 'mock-jwt-token'; // Replace with actual JWT token from the server
        this.saveToken(mockToken); // Save the token
        return user; // Return user details (or a token if your API sends one)
      })
    );
  }
  
  public saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken(); // Returns true if a token exists
  }

  public logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId'); 
    localStorage.removeItem('role'); 
    this.loggedIn.next(false);
  }

  public getAllUsers() {
    return this.http.get<any>(this.apiUrl);
  }

  public getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  } 

  public addPostToUser(userId: number, post: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, { userPost: post });
  }

  public getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  public updateUserProfile(userId: string, updatedDetails: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, updatedDetails).pipe(
      tap((response) => {
        console.log('Updated user details:', response);
      })
    );
  }

  public sendFriendRequest(userId: number, userData: any) {
    return this.http.patch(`${this.apiUrl}/${userId}`, userData);
  }

  // Update user data
  public updateUser(userId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, updatedData);
  }

  public resetPassword(userId: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, { password: newPassword }).pipe(
      tap((response) => {
        console.log('Password reset successfully:', response);
      })
    );
  }
  
  public hidePost(userId: number, postId: number): Observable<any> {
    return this.getUserDetails(userId).pipe(
      map((user) => {
        const updatedPosts = user.userPost.map((post: any) => {
          if (post.id === postId) {
            return { ...post, hidden: true }; // Set the `hidden` flag to true
          }
          return post;
        });
        return updatedPosts;
      }),
      tap((updatedPosts) => {
        this.addPostToUser(userId, updatedPosts).subscribe(
          (response) => {
            console.log('Post hidden successfully:', response);
          },
          (error) => {
            console.error('Error hiding post:', error);
          }
        );
      })
    );
  }  

  public togglePostVisibility(userId: number, postId: number, isHidden: boolean): Observable<any> {
    return this.getUserDetails(userId).pipe(
      map((user) => {
        const updatedPosts = user.userPost.map((post: any) => {
          if (post.id === postId) {
            return { ...post, hidden: isHidden }; // Toggle visibility
          }
          return post;
        });
        return updatedPosts;
      }),
      tap((updatedPosts) => {
        this.addPostToUser(userId, updatedPosts).subscribe(
          (response) => {
            console.log('Post visibility updated successfully:', response);
          },
          (error) => {
            console.error('Error updating post visibility:', error);
          }
        );
      })
    );
  }
  
}
