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
  setAttackDice(armies: number): number {
    return armies >= 3 ? 1 
    : armies >= 2 ? 1
    : 0; //dont substract dice
  }

  attack(params:{
    attackingArmies: number,
    defendingArmies: number,
    attackingDice: number,
  }){
    while(params.defendingArmies > 0 && params.attackingArmies > 1){

      let attackDice = this.rollDiceResult(params.attackingDice - this.setAttackDice(params.attackingArmies)); //attacking dice
      let defenseDice =this.rollDiceResult(params.defendingArmies >= 2 ? 2 : 1); //defending dice
      console.log(attackDice, defenseDice);
      //compare the first element of the attacking array with the first element of the defending array
      for (let i = 0; i < defenseDice.length; i++) {
        if(attackDice[i] <= defenseDice[i]){
          console.log('attack lost ' + ' attack rolled ' + attackDice[i] + ' defense rolled '  + defenseDice[i]);
          params.attackingArmies--;
        } else {
          console.log('defense lost ' + ' attack rolled ' + attackDice[i] + ' defense rolled '  + defenseDice[i]);
          params.defendingArmies--;
        }
      }
      console.log( params.attackingArmies, params.defendingArmies);
    }
}


}
