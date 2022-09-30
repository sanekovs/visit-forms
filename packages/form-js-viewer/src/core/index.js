import EventBus from './EventBus';
import Validator from './Validator';
import FormFieldRegistry from './FormFieldRegistry';
import { ConditionChecker } from './ConditionChecker';

import importModule from '../import';
import renderModule from '../render';

export { FormFieldRegistry };

export default {
  __depends__: [ importModule, renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  validator: [ 'type', Validator ],
  conditionChecker: [ 'type', ConditionChecker ]
};
