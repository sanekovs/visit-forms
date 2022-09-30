import { unaryTest } from 'feelin';

export function ConditionChecker() {

  /**
   * Check if the given condition is met.
   *
   * @param {string} condition
   * @param {import('../types').Data} data
   * @returns
   */
  this.check = function(condition, data) {
    console.log('cond', condition);

    try {
      const result = unaryTest(condition, data);
      return result;
    } catch (error) {
      console.error('condition checker errror:', error);

      return true;
    }
  };
}
