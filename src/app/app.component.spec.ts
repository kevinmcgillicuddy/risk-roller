import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, shareReplay, take } from 'rxjs';
import { AppComponent } from './app.component';
import { DiceService, IResult } from './services/dice.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let diceService: DiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        MatStepperModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSliderModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CommonModule,
        MatSelectModule,
        MatTooltipModule,
        MatButtonModule,
        MatFormFieldModule,
      ],
      providers: [FormBuilder, DiceService]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    diceService = TestBed.inject(DiceService); // Add this line
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form groups and controls', async () => {
    fixture.detectChanges();
    expect(component.attackingCountryGroup.value).toEqual({ attackingArmies: 0, attackingDice: 1, leaveBehind: 1 });
    expect(component.defendingCountryGroup.value).toEqual({ defendingArmies: 1 });
  });

  it('should set the initial values for form controls', () => {
    fixture.detectChanges();
    expect(component.attackingCountryGroup.get('leaveBehind')?.value).toBe(1);
  });

  it('should calculate attacking dice based on attackingArmies of 1', async () => {
    let val: number[] = [];
    component.attackingDice$?.pipe(shareReplay(5)).subscribe((diceOptions) => {
      val = diceOptions
    });
    component.attackingCountryGroup.get('attackingArmies')?.setValue(2);
    fixture.detectChanges();
    expect(val).toEqual([1]);
  });

  it('should calculate attacking dice based on attackingArmies of 3', () => {
    let val: number[] = [];
    component.attackingDice$?.pipe(shareReplay(5)).subscribe((diceOptions) => {
      val = diceOptions
    });
    component.attackingCountryGroup.get('attackingArmies')?.setValue(3);
    fixture.detectChanges();
    expect(val).toEqual([1, 2]);
  });

  it('should calculate attacking dice based on attackingArmies of 4', () => {
    let val: number[] = [];
    component.attackingDice$?.pipe(shareReplay(5)).subscribe((diceOptions) => {
      val = diceOptions
    });
    component.attackingCountryGroup.get('attackingArmies')?.setValue(4);
    fixture.detectChanges();
    expect(val).toEqual([1, 2, 3]);
  });


  it('should call diceService.attack on submit', () => {
    const mockResult = {
      winner: '⚔️ Attacker',
      roll: [],
      remaining: {
        attacker: 5,
        defender: 3,
      },
    } as IResult;
    spyOn(diceService, 'attack').and.returnValue(of(mockResult));

    component.attackingCountryGroup.get('attackingArmies')?.setValue(5);
    component.defendingCountryGroup.get('defendingArmies')?.setValue(3);
    component.attackingCountryGroup.get('attackingDice')?.setValue(3);
    component.attackingCountryGroup.get('leaveBehind')?.setValue(1);

    component.submit();

    expect(diceService.attack).toHaveBeenCalledWith({
      attackingArmies: 5,
      defendingArmies: 3,
      attackingDice: 3,
      attackStop: 1,
    });

    component.result$?.pipe(take(1)).subscribe((result) => {
      expect(result).toEqual(mockResult);
    });
  });

});



