import { FormContext } from '../../../../../../src/render/context';
import { FeelersTemplating, MarkdownRenderer, FeelExpressionLanguage, ConditionChecker } from '@bpmn-io/form-js-viewer';
import { Textfield } from '../../../../../../src/render';

const _defaults = {
  templateEvaluator: new FeelersTemplating(),
  expressionLanguage: new FeelExpressionLanguage(),
  markdownRenderer: new MarkdownRenderer(),
  FormFieldComponent: Textfield
};

export function WithFormContext(Component, options = {}, formId = 'foo') {

  function getService(type, strict) {

    const {
      initialData = {},
      data = {},
      errors = {},
      properties = {},
      isExpression = _defaults.expressionLanguage.isExpression,
      evaluateExpression = _defaults.expressionLanguage.evaluate,
      isTemplate = _defaults.templateEvaluator.isTemplate,
      evaluateTemplate = _defaults.templateEvaluator.evaluate,
      markdownRenderer = _defaults.markdownRenderer,
      FormFieldComponent = _defaults.FormFieldComponent,
      checkCondition = () => false,
      applyConditions = (data) => data
    } = options;

    const services = {
      formFields: {
        get(type) {
          if (type === FormFieldComponent.type) {
            return FormFieldComponent;
          }
        }
      },
      form: {
        _getState() {
          return {
            data,
            errors,
            properties,
            initialData
          };
        }
      },
      conditionChecker: {
        applyConditions,
        check(...args) {
          return checkCondition && checkCondition(...args);
        }
      },
      templating: {
        isTemplate,
        evaluate(...args) {
          return evaluateTemplate(...args);
        }
      },
      markdownRenderer,
      expressionLanguage: {
        isExpression,
        evaluate(...args) {
          return evaluateExpression(...args);
        }
      }
    };

    return services[type];
  }

  const formContext = {
    getService,
    formId
  };

  return (
    <FormContext.Provider value={ formContext }>
      { Component }
    </FormContext.Provider>
  );
}