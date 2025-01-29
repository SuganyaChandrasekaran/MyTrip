import { Component, OnInit } from "@angular/core";
import { BookingService } from "../services/booking.service";
import { Router } from "@angular/router";
import { Ticket } from "../models/ticket.model";

@Component({
  selector: "app-print",
  templateUrl: "./print.component.html",
  styleUrls: ["./print.component.css"],
})
export class PrintComponent implements OnInit {
  public createTicket: Ticket;

  constructor(private BookingService: BookingService, private route: Router) {}

  ngOnInit(): void {
    this.BookingService.cast$.subscribe((res) => (this.createTicket = res));
    if (!this.createTicket) {
      this.route.navigate([""]);
    }
  }
}
