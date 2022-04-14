import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { map, mergeMap, Observable, of } from 'rxjs';
import { DiceService, IResult } from './services/dice.service';


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
  public result$: Observable<IResult>;
  public attackingDice$: Observable<number[]> | undefined;
  constructor(private _formBuilder: FormBuilder, private diceService: DiceService, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const attackingArmies = control.get("attackingArmies")?.value;
    const attackingStop = control.get("attackingStop")?.value;
    if (attackingStop > attackingArmies) { return { 'noMatch': true } }
    return null
  }
  ngOnInit() {

    this.attackingCountryGroup = this._formBuilder.group({
      attackingArmies: ['', [Validators.required, Validators.min(2)]],
      attackingDice: ['', Validators.required],
      attackingStop: ['', Validators.required],
    });
    this.defendingCountryGroup = this._formBuilder.group({
      defendingArmies: ['', [Validators.required, Validators.min(1)]],
    });

    this.attackingDice$ = this.attackingCountryGroup.get('attackingArmies')?.valueChanges.pipe(
      mergeMap(number => number <= 2 ? of([1])
        : number <= 3 ? of([1, 2])
          : of([1, 2, 3]))
    )
  }
  submit() {
    this.result$ = this.diceService.attack({
      attackingArmies: this.attackingCountryGroup.get('attackingArmies')!.value,
      defendingArmies: this.defendingCountryGroup.get('defendingArmies')!.value,
      attackingDice: this.attackingCountryGroup.get('attackingDice')!.value,
      attackStop: this.attackingCountryGroup.get('attackingStop')!.value
    })
  }

}
