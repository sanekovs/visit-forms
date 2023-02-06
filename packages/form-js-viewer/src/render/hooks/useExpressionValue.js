import { isString } from 'min-dash';

import useService from './useService';
import { useEvaluation } from './useEvaluation';
import { useInterpolatedEvaluation } from './useInterpolatedEvaluation';

/**
 *
 * @param {string} value
 */
export function useExpressionValue(value) {
  const formData = useService('form')._getState().data;

  if (isExpression(value)) {

    // We can ignore this hook rule as we do not use
    // state or effects in our custom hooks
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    return useEvaluation(value, formData);
  }

  if (isTemplated(value)) {

    // We can ignore this hook rule as we do not use
    // state or effects in our custom hooks
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    return useInterpolatedEvaluation(value, formData);
  }


  return value;
}


// helper ///////////////

function isExpression(value) {
  return isString(value) && value.startsWith('=');
}

function isTemplated(value) {
  const open = value.indexOf('{{');
  if (open === -1) return false;
  const close = value.substring(open + 1).indexOf('}}');
  return close !== -1;
}
