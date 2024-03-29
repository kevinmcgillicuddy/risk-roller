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

  describe('rollDiceResult() ', () => {
    it('should return a number of arrays', () => {
      let dice = service.rollDiceResult(2)
      expect(dice.length).toBeGreaterThan(0);
    });
  });

  describe('maxAttackDice() ', () => {
    it('should return a number', () => {
      let attackDice = service.maxAttackDice(attackingArmies, 2);
      expect(attackDice).toBeGreaterThan(0);
    });

    it('should return a valid number', () => {
      let attackDice = service.maxAttackDice(2, 3);
      expect(attackDice).toBe(1);
    });

    it('should return 0 when armies is 1', () => {
      let attackDice = service.maxAttackDice(1, 3);
      expect(attackDice).toBe(0);
    });
  });

  describe('rollDiceResult()', () => {
    it('should return an array of numbers', () => {
      const times = 3;
      const result = service.rollDiceResult(times);
      expect(Array.isArray(result)).toBe(true);
      expect(result.every((num) => typeof num === 'number')).toBe(true);
    });

    it('should return an array with the specified length', () => {
      const times = 5;
      const result = service.rollDiceResult(times);
      expect(result.length).toBe(times);
    });

    it('should return an array with numbers between 1 and 6', () => {
      const times = 10;
      const result = service.rollDiceResult(times);
      expect(result.every((num) => num >= 1 && num <= 6)).toBe(true);
    });

    it('should return an array sorted in descending order', () => {
      const times = 4;
      const result = service.rollDiceResult(times);
      expect(result).toEqual(result.sort((a, b) => b - a));
    });
  });

  describe('attack() ', () => {
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

});
