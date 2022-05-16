import { TestBed } from '@angular/core/testing';
import { DiceService, IResult } from './dice.service';


describe('DiceService', () => {
  let service: DiceService;
  let attackingArmies: number;
  let defendingArmies: number;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiceService);
    attackingArmies = Math.floor(Math.random() * (20 - 1) + 2);
    defendingArmies = Math.floor(Math.random() * (15 - 1) + 1);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('roll dice should return a number of arrays', () => {
    let dice = service.rollDiceResult(2)
    expect(dice.length).toBeGreaterThan(0);
  });

  it('maxAttackDice a number', () => {
    let attackDice = service.maxAttackDice(10, 2);
    expect(attackDice).toBeGreaterThan(0);
  });

  it('should have attack return an observable', () => {
    let result: IResult;
    service.attack({
      attackingArmies,
      defendingArmies,
      attackingDice: service.maxAttackDice(attackingArmies, 3),
      attackStop: 3
    }).subscribe(res => {
      result = res
      expect(result).not.toBeNull();
      expect(result.roll.length).not.toBeNull();
    })
  })

  it('should have attack return valid remaining armies', () => {
    let result: IResult;
    service.attack({
      attackingArmies,
      defendingArmies,
      attackingDice: service.maxAttackDice(attackingArmies, 3),
      attackStop: 5
    }).subscribe(res => {
      result = res
      expect(result.remaining?.attacker).toBeGreaterThanOrEqual(0);
      expect(result.remaining?.defender).toBeGreaterThanOrEqual(0);
    })
  })

  it('should have attack return valid remaining armies per each roll', () => {
    let result: IResult;
    service.attack({
      attackingArmies,
      defendingArmies,
      attackingDice: service.maxAttackDice(attackingArmies, 3),
      attackStop: 1
    }).subscribe(res => {
      result = res
      expect(result.roll.find(e => e.attackingArmiesLeft < 0)).toBeUndefined();
      expect(result.roll.find(e => e.defendingArmiesLeft < 0)).toBeUndefined();
    })
  })

});
