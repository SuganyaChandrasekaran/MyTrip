import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Journey } from "../models/journey.model";
import { BookingService } from "../services/booking.service";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.css"],
})
export class UserFormComponent implements OnInit {
  public journey: Journey;
  public user: User;
  
  constructor(private BookingService: BookingService, private route: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.journey = JSON.parse(localStorage.getItem("journey"));
    if (!this.journey) {
      this.route.navigate([""]);
    }
  }

  public userForm(form: NgForm) {
    this.user.user_name = form.value.user_name;
    this.user.mobile = form.value.user_mobile;
    this.user.user_email = form.value.user_email;

    // Pass the user and journey data to the service
    if (this.journey) {
      this.BookingService.seatBooking(this.journey, this.user);
    } else {
      console.error("Journey data is missing");
    }
  }
}
