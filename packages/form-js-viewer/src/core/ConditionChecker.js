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
    try {
      const result = unaryTest(condition, data);

      console.log(`condition "${condition}" result: ${result}`);
      if (result === null) {
        return true;
      }

      return result;
    } catch (error) {
      console.error('condition checker errror:', error);

      return true;
    }
  };
}
