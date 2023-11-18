import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { AppComponent } from './app.component';
import { DiceService } from './services/dice.service';
import { of } from 'rxjs';
import { spyOn } from 'jasmine';

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
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
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
    };
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
