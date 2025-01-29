import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly ROOT_URL: string;

  constructor(private http: HttpClient) {
    this.ROOT_URL = "https://bdbusticket.firebaseio.com/";
  }

  /**
   * Creates a new user and returns an observable to handle the response or error.
   * @param user - The user object to be created.
   * @returns Observable of the HTTP POST request result.
   */
  public createUser(user: User): Observable<any> {
    return this.http.post(`${this.ROOT_URL}users.json`, user).pipe(
      // You can catch any error here
      catchError((error) => {
        console.error("Error creating user:", error);
        throw error; // Rethrow error or handle it appropriately
      })
    );
  }
}
