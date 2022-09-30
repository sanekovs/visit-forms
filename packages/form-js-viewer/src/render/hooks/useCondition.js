import useService from './useService';

export function useCondition(condition, data) {
  const conditionChecker = useService('conditionChecker');

  if (!condition) {
    return true;
  }

  console.log(condition);

  return conditionChecker.check(condition, data);
}
