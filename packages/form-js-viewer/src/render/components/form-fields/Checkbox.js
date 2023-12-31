import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';
import classNames from 'classnames';

const type = 'checkbox';


export default function Checkbox(props) {
  const {
    disabled,
    errors = [],
    field,
    value = false
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.checked
    });
  };

  const { formId } = useContext(FormContext);

  return <div class={ classNames(formFieldClasses(type, { errors, disabled }), { 'fjs-checked': value }) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required }>
      <input
        checked={ value }
        class="fjs-input"
        disabled={ disabled }
        id={ prefixId(id, formId) }
        type="checkbox"
        onChange={ onChange } />
    </Label>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Checkbox.create = (options = {}) => ({
  ...options
});

Checkbox.type = type;
Checkbox.label = 'Checkbox';
Checkbox.keyed = true;
Checkbox.emptyValue = false;
Checkbox.sanitizeValue = ({ value }) => value === true;
Checkbox.group = 'selection';