import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { SelectBusService } from "../services/selectBus.service";
import { Subscription } from "rxjs";
import { Bus } from "../models/bus.model";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { Router } from "@angular/router";

@Component({
  selector: "search-result-info",
  templateUrl: "./bus-search-result.component.html",
  styleUrls: ["./bus-search-result.component.css"],
})
export class BusSearchResultComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public buses: Bus[];
  public modalRef: BsModalRef;
  public route = new Object();

  constructor(
    private BusService: SelectBusService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.buses = [];
  }

  ngOnInit() :void{
    this.route = JSON.parse(localStorage.getItem("route"));
    if (!this.route) {
      this.router.navigate([""]);
    }
    this.subscription = this.BusService.castId.subscribe((res) =>
      this.getAllBus(res)
    );
  }

  public getAllBus(res) {
    let bus = new Object();
    this.BusService.getBus(res).subscribe((res) => {
      for (let key in res) {
        bus = res[key];
        bus["$key"] = key;

        this.buses.push(bus as Bus);
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openModal(template: TemplateRef<any>, bus) {
    this.modalRef = this.modalService.show(template);
    // let journey={
    //   route:this.route,
    //   bus_info:bus,
    //   seats:
    // }
  }
  public closeModal() {
    this.modalRef.hide();
  }
}
