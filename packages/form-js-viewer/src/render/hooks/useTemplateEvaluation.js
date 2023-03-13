import useService from './useService';
import useFilteredFormData from './useFilteredFormData';
import { useMemo } from 'preact/hooks';

/**
 * Template a string reactively based on form data.
 * If the string is not a template, it is returned as is.
 *
 * @param {string} value
 *
 */
export default function useTemplateEvaluation(value, options) {
  const filteredData = useFilteredFormData();
  const templating = useService('templating', false);

  return useMemo(() => {

    if (templating && templating.isTemplate(value)) {
      return templating.evaluate(value, filteredData, options);
    }

    return value;

  }, [ filteredData, templating, value, options ]);
}
