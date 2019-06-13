import { Injectable } from "@angular/core";
import { Observable, interval, timer } from "rxjs";
import { map, share } from 'rxjs/operators';
@Injectable()
export class ClockService {

  private clock: Observable<any>;

  constructor() {
  }
  setClock(date: Date): Observable<any> {
    this.clock = interval(1000).pipe(map(tick => {
      return this.getHMS(date);
    }, share()));
    return this.clock;
  }
  // getClock(): Observable<Date> {
  //   // return this.clock;
  // }
  getHMS(date) {
    let diff = date.getTime() - new Date().getTime();
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    minutes %= 60;
    seconds %= 60;
    return {
      h: hours,
      m: minutes,
      s: seconds
    };
  }
}
