import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import { map, mergeMap, Observable, of } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public attackingCountryGroup: FormGroup;
  public defendingCountryGroup: FormGroup;
  public attackingArmies: FormControl
  public attackingDice$: Observable<number[]> | undefined;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.attackingCountryGroup = this._formBuilder.group({
      attackingName: ['', Validators.required],
      attackingArmies: ['', [Validators.required, Validators.min(2)]],
      attackingDice: ['', Validators.required]
    });
    this.defendingCountryGroup = this._formBuilder.group({
      defendingName: ['', Validators.required],
      defendingArmies: ['', [Validators.required, Validators.min(1)]],
    });

    this.attackingDice$ = this.attackingCountryGroup.get('attackingArmies')?.valueChanges.pipe(
      mergeMap(number => number <= 2 ? of([1]): of([1,2]))
    )
  }
}
