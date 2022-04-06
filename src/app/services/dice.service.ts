import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  constructor() { }

  /**
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
   * @returns the number of dice an attacker is allowed to roll based on number of armies
   */
  maxDice(armies: number, pref: number): number {
    //2 < 10
    //1 < 10
    //1 < 2
    //2 < 3
    if (pref < armies) {
      return pref;
    } else {
      //pref -- army
      //3 -- 2

      return pref--;
    }
    // if (armies >= 4) {
    //   return pref; //dont subtract any dice
    // } else if (armies === 3 && (pref >= armies)) {
    //   return 2; //subtract 1 dice
    // } else (armies === 2) {
    //   return 1; //subtract 2 dice armies must be 2
    // }
  }

  attack(params: {
    attackingArmies: number,
    defendingArmies: number,
    attackingDice: number,
  }) {
    while (params.defendingArmies > 0 && params.attackingArmies > 1) {
      console.log('************')
      console.log(this.maxDice(params.attackingArmies, params.attackingDice))
      console.log('************')


      let attackDice = this.rollDiceResult(this.maxDice(params.attackingArmies, params.attackingDice)); //attacking dice
      let defenseDice = this.rollDiceResult(params.defendingArmies >= 2 ? 2 : 1); //defending dice
      console.log(attackDice, defenseDice);
      //compare the first element of the attacking array with the first element of the defending array
      for (let i = 0; i < defenseDice.length; i++) {
        //if mismatch between the attacking array and the the defending array, skip
        if (!attackDice[i] || !defenseDice[i]) {
          continue;
        }
        if (attackDice[i] <= defenseDice[i]) {
          console.log('🛡️ Attack lost! ' + ' Attack rolled ' + attackDice[i] + ' Defense rolled ' + defenseDice[i]);
          params.attackingArmies--;
        } else {
          console.log('🗡️ Defense lost ' + ' Attack rolled ' + attackDice[i] + ' Defense rolled ' + defenseDice[i]);
          params.defendingArmies--;
        }
      }
      console.log(params.attackingArmies, params.defendingArmies);
    }
  }


}
