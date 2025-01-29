import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Bus } from "../models/bus.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SelectBusService {
  private Root_url: string;
  private routeId: BehaviorSubject<string>;
  public castId: Observable<string>;

  constructor(private http: HttpClient) {
    this.Root_url = "https://bdbusticket.firebaseio.com/";
    this.routeId = new BehaviorSubject<string>("");
    this.castId = this.routeId.asObservable();
  }

  public getBus(routeId): Observable<any> {
    return this.http.get(this.Root_url + "buses/" + routeId + ".json");
  }

  public getRoueId(routeId) {
    this.routeId.next(routeId);
  }

  public getFillupseat(key: string, busID: string): Observable<any> {
    return this.http.get(
      this.Root_url + "booking/" + key + "/" + busID + "/seat_booking.json"
    );
    //console.log(this.Root_url+'booking/'+key+'/'+busID+'.json')
  }

  public getRoute(key: string): Observable<any> {
    return this.http.get(this.Root_url + "routes/" + key + ".json");
  }
}
