import useService from './useService';

export function useCondition(condition, data) {
  const conditionChecker = useService('conditionChecker', false);

  if (!condition || !conditionChecker) {
    return true;
  }

  console.log(condition);

  return conditionChecker.check(condition, data);
}
