import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  constructor() { }

  /**
   * @param times the number of dice to roll to return as part of the array aka the users roll of dice
   * @returns an array of numbers between 1 and 6, sorted high to low
   */
  rollDiceResult(times: number): number[] {
    let result = [];
    for (let i = 0; i < times; i++) {
      result.push(Math.floor(Math.random() * (7 - 1) + 1));
    }
    return result.sort((a, b) => b - a);
  }

  /**
   * In risk you when you attack you must always leave behind 1 army. For this reason your attack dice cannot match the number of armies you have, 
   * since you must always move at least those number of armies to the conquered territory if you win.
   * @param armies the number of armies attacking
   * @param preferedDice the number of dice the user perferrs to roll
   * @returns the number of dice an attacker is allowed to roll based on number of armies
   */
  maxAttackDice(armies: number, preferedDice: number): number {
    //if the attacker has more armies than the prefered dice, return the prefered dice
    if (armies > preferedDice) {
      return preferedDice;
    }
    //if the attacker has 1 or less armies return 0 dice
    if (armies <= 1) {
      return 0;
    }
    //while attacker armies is less then prefered dice, take 1 from the perfered dice
    do {
      preferedDice--;
    } while (armies <= preferedDice)

    return preferedDice;
  }

  attack(params: {
    attackingArmies: number,
    defendingArmies: number,
    attackingDice: number,
    attackStop: number,
  }): Observable<IResult> {

    let result: IResult = {
      roll: [{
        attackingArmiesLeft: params.attackingArmies,
        defendingArmiesLeft: params.defendingArmies,
        attackingDice: [],
        defendingDice: [],
        resultString: []
      }]
    }

    while (params.defendingArmies > 0 && params.attackingArmies > params.attackStop) {
      //array of attacking dice
      let attackDice = this.rollDiceResult(this.maxAttackDice(params.attackingArmies, params.attackingDice));
      //array of defending dice
      let defenseDice = this.rollDiceResult(params.defendingArmies >= 2 ? 2 : 1);
      //compare the first element of the attacking array with the first element of the defending array
      for (let i = 0; i < defenseDice.length; i++) {
        //if mismatch between the attacking array and the the defending array, skip - ie there are more attacking dice than defending dice
        //because it sorts the lowest attacker dice is discarded in this case
        if (!attackDice[i] || !defenseDice[i]) {
          continue;
        }
        //if the attacking dice is less than or equal to the defending dice, the attacker looses an army
        if (attackDice[i] <= defenseDice[i]) {
          params.attackingArmies--;
        } else {
          params.defendingArmies--;
        }
      }

      result.roll?.push({
        attackingArmiesLeft: params.attackingArmies,
        defendingArmiesLeft: params.defendingArmies,
        attackingDice: attackDice,
        defendingDice: defenseDice,
      });
    }

    return of({
      roll: result.roll,
      winner: params.defendingArmies > 0 ? '🛡️ Defender' : '⚔️ Attacker',
      remaining: {
        attacker: params.attackingArmies,
        defender: params.defendingArmies
      }
    } as IResult)
  }

}
export interface IResult {
  winner?: '⚔️ Attacker' | '🛡️ Defender';
  roll: {
    attackingArmiesLeft: number;
    defendingArmiesLeft: number;
    attackingDice: number[];
    defendingDice: number[];
    resultString?: string[];
  }[],
  remaining?: {
    attacker: number,
    defender: number
  }

}