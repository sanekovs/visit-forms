import useService from './useService';

export function useCondition(condition, data) {
  const conditionChecker = useService('conditionChecker', false);

  if (!condition || !conditionChecker) {
    return true;
  }

  return conditionChecker.check(condition, data);
}
