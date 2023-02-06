import useService from './useService.js';

/**
 *
 * @param {string | undefined} toInterpolate
 * @param {import('../../types').Data} data
 */
export function useInterpolatedEvaluation(toInterpolate, data) {
  const initialData = useService('form')._getState().initialData;
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return null;
  }

  // make sure we do not use data from hidden fields
  const filteredData = {
    ...initialData,
    ...conditionChecker.applyConditions(data, data)
  };

  const matchRegex = /{{([^{}]*)}}/g;

  return toInterpolate.replace(matchRegex, (_, p1) => {
    return conditionChecker.evaluate(p1, filteredData);
  });
}
