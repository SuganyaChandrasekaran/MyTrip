import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    localStorage.removeItem("journey");
    localStorage.removeItem("route");
    localStorage.removeItem("user");
  }
}
