import { Injectable } from "@angular/core";
import { Journey } from "../models/journey.model";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private readonly ROOT_URL: string = "https://bdbusticket.firebaseio.com/";
  public journeyInfo$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public cast$: Observable<any> = this.journeyInfo$.asObservable();
  private booking: Record<string, any> = {};
  private key: number;
  private busId: string;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Initiates seat booking for the given journey and user.
   * @param journey - Journey details.
   * @param user - User details.
   */
  public async seatBooking(journey: Journey, user: User): Promise<void> {
    this.busId = journey.bus.$key;
    this.key = new Date(journey.journey_route.date).getTime();

    try {
      const userIdObservable = this.createUserID(user);
      userIdObservable.subscribe((response) => {
        this.booking = {
          user_id: Object.values(response)[0],
          seats: journey.seats,
        };
        this.checkBookingDateAndBusInfo(this.key, journey, this.booking, this.busId);
      });
    } catch (error) {
      console.error("Error in seatBooking:", error);
    }
  }

  private checkBookingDateAndBusInfo(
    key: number,
    journey: Journey,
    booking: any,
    busId: string
  ): void {
    const keys: string[] = [];
    this.http.get(`${this.ROOT_URL}booking.json`).subscribe((response) => {
      for (const key in response) {
        keys.push(key);
      }
      if (keys.includes(String(key))) {
        this.checkBusId(busId, key, booking, journey);
      } else {
        this.createBookingDate(journey, key, booking, busId);
      }
    });
  }

  private checkBusId(busId: string, key: number, booking: any, journey: Journey): void {
    const busIdArray: string[] = [];
    this.http.get(`${this.ROOT_URL}booking/${key}.json`).subscribe((response) => {
      for (const id in response) {
        busIdArray.push(id);
      }
      if (busIdArray.includes(busId)) {
        this.createBooking(booking, key, busId);
      } else {
        this.createBookingDetails(journey, key, busId, booking);
      }
    });
  }

  private async createBookingDate(
    journey: Journey,
    key: number,
    booking: any,
    busId: string
  ): Promise<void> {
    await this.createBookingDetails(journey, key, busId, booking);
  }

  private createBookingDetails(
    journey: Journey,
    key: number,
    busId: string,
    booking: any
  ): void {
    const location = `${journey.journey_route.leaving_form} to ${journey.journey_route.going_to}`;
    this.http
      .put(`${this.ROOT_URL}booking/${key}/${busId}.json`, {
        bus: {
          location,
          name: journey.bus.name,
          coach_type: journey.bus.coach_type,
          fare: journey.bus.fare,
          time: journey.bus.time,
          seat: journey.bus.seat,
        },
      })
      .subscribe({
        next: () => this.createBooking(booking, key, busId),
        error: (error) => console.error("Error in createBookingDetails:", error),
      });
  }

  private createBooking(booking: any, key: number, busId: string): void {
    this.http
      .post(`${this.ROOT_URL}booking/${key}/${busId}/seat_booking.json`, booking)
      .subscribe({
        next: (response) => {
          const ticketId = Object.values(response)[0];
          this.createPrintView(ticketId);
        },
        error: (error) => console.error("Error in createBooking:", error),
      });
  }

  private createUserID(user: User): Observable<any> {
    localStorage.setItem("user", JSON.stringify(user));
    return this.userService.createUser(user);
  }

  private createPrintView(ticketId: string): void {
    const journey = JSON.parse(localStorage.getItem("journey"));
    const user = JSON.parse(localStorage.getItem("user"));
    const ticketDetails = {
      ticketId,
      journey,
      user,
    };
    this.setJourneyInfo(ticketDetails);
    this.router.navigate(["print"]);
  }

  private setJourneyInfo(ticket: any): void {
    this.journeyInfo$.next(ticket);
    localStorage.removeItem("journey");
    localStorage.removeItem("route");
    localStorage.removeItem("user");
  }
}
