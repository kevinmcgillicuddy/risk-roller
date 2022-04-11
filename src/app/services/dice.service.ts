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
  }): Observable<any[]> {

    let result: any[] = []
    while (params.defendingArmies > 0 && params.attackingArmies >= params.attackStop) {

      console.log(' 🎖️ ' + this.maxAttackDice(params.attackingArmies, params.attackingDice));

      let attackDice = this.rollDiceResult(this.maxAttackDice(params.attackingArmies, params.attackingDice)); //attacking dice
      let defenseDice = this.rollDiceResult(params.defendingArmies >= 2 ? 2 : 1); //defending dice

      console.log('attack used ' + attackDice.length + ' dice and had ' + params.attackingArmies + ' armies');
      console.log('defenese used ' + defenseDice.length + ' dice and had ' + params.defendingArmies + ' armies');

      //compare the first element of the attacking array with the first element of the defending array
      for (let i = 0; i < defenseDice.length; i++) {
        //if mismatch between the attacking array and the the defending array, skip
        if (!attackDice[i] || !defenseDice[i]) {
          continue;
        }
        if (attackDice[i] <= defenseDice[i]) {
          console.log('🛡️ Attack lost! ' + ' Attack rolled ' + attackDice[i] + ' Defense rolled ' + defenseDice[i]);
          params.attackingArmies--;
          result.push('🛡️ Attack lost! ' + ' Attack rolled ' + attackDice[i] + ' Defense rolled ' + defenseDice[i] + ' Attacking armies left: ' + params.attackingArmies);
          result.push('Attacking Armies left: ' + params.attackingArmies);
        } else {
          console.log('🗡️ Defense lost! ' + ' Attack rolled ' + attackDice[i] + ' Defense rolled ' + defenseDice[i]);
          params.defendingArmies--;
          result.push('🗡️ Defense lost! ' + ' Attack rolled ' + attackDice[i] + ' Defense rolled ' + defenseDice[i]);
          result.push('Defending Armies left: ' + params.defendingArmies);
        }
      }
      console.log('Attacking Armies left: ' + params.attackingArmies + ' Defending Armies left: ' + params.defendingArmies);
    }
    return of(result)
  }

}
interface IResult {
  winner?: 'attacker' | 'defender';
  roll: {
    attackingArmiesLeft?: number;
    defendingArmiesLeft?: number;
    attackingDice?: number[];
    defendingDice?: number[];
  }[]

}