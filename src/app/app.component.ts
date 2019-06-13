import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ClockService } from './clock.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounce } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  time;
  isEditing = true;
  timeForm: FormGroup;
  private subscriptions: Subscription;

  constructor(private st: ClockService) { }
  ngOnInit() {
    this.timeForm = new FormGroup({
      h: new FormControl(0, [Validators.min(0)]),
      m: new FormControl(0, [Validators.max(60), Validators.min(0)]),
      s: new FormControl(0, [Validators.max(60), Validators.min(0)])
    });
    this.timeForm.controls['m'].valueChanges.pipe(debounce(() => interval(8))).subscribe(val => {
      if (val > 60) {
        this.timeForm.controls['m'].setValue(60);
      }
    });
    this.timeForm.controls['s'].valueChanges.pipe(debounce(() => interval(8))).subscribe(val => {
      if (val > 60) {
        this.timeForm.controls['s'].setValue(60);
      }
    });
  }
  startClock() {
    if (this.timeForm.controls['s'].value + this.timeForm.controls['h'].value + this.timeForm.controls['m'].value !== 0) {
      if (this.subscriptions) {
        this.subscriptions.unsubscribe();
      }
      this.isEditing = false;
      let limitDate = new Date((Date.now()) + this.getMilisHMS());
      console.log(limitDate);
      this.time = this.st.getHMS(limitDate);
      this.subscriptions = this.st.setClock(limitDate).subscribe(time => {
        console.log(time);
        this.time = time;
      });
    }
  }
  getMilisHMS() {
    let milisH = (typeof this.timeForm.controls['h'].value === 'number' ? this.timeForm.controls['h'].value : 0) * 60 * 60 * 1000;
    let milisM = (typeof this.timeForm.controls['m'].value === 'number' ? this.timeForm.controls['m'].value : 0) * 60 * 1000;
    let milisS = (typeof this.timeForm.controls['s'].value === 'number' ? this.timeForm.controls['s'].value : 0) * 1000;
    return milisH + milisM + milisS;
  }
  resetClock() {
    this.isEditing = true;
    this.subscriptions.unsubscribe();
  }
}
