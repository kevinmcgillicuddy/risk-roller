import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { map, mergeMap, Observable, of } from 'rxjs';
import { DiceService } from './services/dice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public attackingCountryGroup: FormGroup;
  public defendingCountryGroup: FormGroup;
  public attackingArmies: FormControl;
  public stepperOrientation: Observable<StepperOrientation>;

  public panelOpenState = false;

  public result$: Observable<string[]>;
  public attackingDice$: Observable<number[]> | undefined;
  constructor(private _formBuilder: FormBuilder, private diceService: DiceService, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.diceService.attack({
      attackingArmies: 15,
      defendingArmies: 25,
      attackingDice: 2
    })
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
      mergeMap(number => number <= 2 ? of([1]) : of([1, 2]))
    )
  }

  submitAttacking() {
    console.log(this.attackingCountryGroup.value);
  }

  submitDefending() {

  }
}
