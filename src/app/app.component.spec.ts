import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
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
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { DiceService, IResult } from './services/dice.service';

describe('AppComponent', () => {
  let component: AppComponent;
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
        MatSelectModule,
        MatTooltipModule,
        MatButtonModule,
        MatFormFieldModule,
      ],
      providers: [UntypedFormBuilder, DiceService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize the form groups and controls', () => {
    expect(component.attackingCountryGroup).toBeDefined();
    expect(component.defendingCountryGroup).toBeDefined();
    expect(component.attackingArmies).toBeDefined();
  });

  it('should set the initial values for form controls', () => {
    expect(component.attackingCountryGroup.get('leaveBehind')?.value).toBe(1);
  });

  it('should calculate attacking dice based on attackingArmies', () => {
    component.attackingCountryGroup.get('attackingArmies')?.setValue(2);
    expect(component.attackingDice$).toEqual(of([1]));

    component.attackingCountryGroup.get('attackingArmies')?.setValue(3);
    expect(component.attackingDice$).toEqual(of([1, 2]));

    component.attackingCountryGroup.get('attackingArmies')?.setValue(4);
    expect(component.attackingDice$).toEqual(of([1, 2, 3]));
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

    expect(diceService.attack).toHaveBeenCalled();
    expect(component.result$).toEqual(of(mockResult));
  });
});
