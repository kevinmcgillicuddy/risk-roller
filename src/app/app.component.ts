import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkStep } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { finalize, map, mergeMap, Observable, of, take } from 'rxjs';
import { DiceService, IResult } from './services/dice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public attackingCountryGroup: UntypedFormGroup;
  public defendingCountryGroup: UntypedFormGroup;
  public attackingArmies: UntypedFormControl;
  public stepperOrientation: Observable<StepperOrientation>;
  public result$: Observable<IResult>;
  public attackingDice$: Observable<number[]> | undefined;

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('stepOne') stepOne: CdkStep;
  constructor(private _formBuilder: UntypedFormBuilder, private diceService: DiceService, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  ngOnInit() {
    this.attackingCountryGroup = this._formBuilder.group({
      attackingArmies: ['', [Validators.required, Validators.min(2),]],
      attackingDice: ['', Validators.required],
      leaveBehind: [1, [Validators.required, Validators.min(1)]],
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
      attackStop: this.attackingCountryGroup.get('leaveBehind')!.value
    }).pipe(
      take(1),
      finalize(() => {
        this.stepper.selected!.interacted = false;
        this.stepper.selected = this.stepOne;
      })
    )
  }
}
