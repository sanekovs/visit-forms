import { useContext, useMemo, useRef, useState } from 'preact/hooks';

import classNames from 'classnames';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';
import InputAdorner from './parts/InputAdorner';

const type = 'number';


export default function Number(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    onChange,
    value
  } = props;

  const {
    description,
    id,
    prefixAdorner,
    suffixAdorner,
    validate = {},
    decimalDigits,
    step
  } = field;

  const { required } = validate;

  const [ rawValueCache, setRawValueCache ] = useState('');
  const numberInputRef = useRef();

  const valueCacheMismatch = useMemo(() => Number.sanitizeValue({ value, formField: field }) !== Number.sanitizeValue({ value: rawValueCache, formField: field }), [ field, rawValueCache, value ]);
  const displayValue = useMemo(() => valueCacheMismatch ? (value && value.toString() || '') : rawValueCache, [ rawValueCache, value, valueCacheMismatch ]);
  const appliedStep = useMemo(() => step || (decimalDigits ? (1 / 10 ** decimalDigits) : undefined), [ decimalDigits, step ]);

  const onKeyPress = (e) => {

    // e.which is only greater than zero if the keypress is a printable key.
    // We need to filter out backspace and ctrl/alt/meta key combinations
    const isNotCharacterPress = !(typeof e.which == 'number' && e.which > 0) || e.ctrlKey || e.metaKey || e.altKey || e.which === 8;

    const isFirstDot = !numberInputRef.current.value.includes('.') && e.key === '.';
    const isFirstMinus = !numberInputRef.current.value.includes('-') && e.key === '-';

    const keypressIsNumeric = /^[0-9]$/i.test(e.key);

    const keypressIsAllowedChar = keypressIsNumeric || ((decimalDigits !== 0) && isFirstDot) || isFirstMinus;

    const validKeyInput = isNotCharacterPress || keypressIsAllowedChar;

    !validKeyInput && e.preventDefault();
  };

  const onInput = (e) => {

    let newRawValue = e.target.value;
    let newValue;

    const clearState = () => {
      setRawValueCache('');
      onChange({ field, value: null });
    };

    // Handle integers first
    if (decimalDigits === 0) {

      const valueAsInt = parseInt(newRawValue);

      // If an invalid integer was pasted in, clear
      if (isNaN(valueAsInt)) {
        clearState();
        return;
      }

      newValue = valueAsInt;

    }
    else {

      // Treat commas as dots
      newRawValue = newRawValue.replace(',', '.');
      let valueAsFloat = parseFloat(newRawValue);

      // If an invalid number was pasted in, clear
      if (isNaN(valueAsFloat)) {
        clearState();
        return;
      }

      // @ts-ignore
      if (decimalDigits && (parseInt(valueAsFloat) !== valueAsFloat)) {
        const [ integerPart, decimalPart ] = newRawValue.split('.');
        newRawValue = integerPart + '.' + decimalPart.substring(0, decimalDigits);
        valueAsFloat = parseFloat(newRawValue);
      }

      newValue = valueAsFloat;
    }

    setRawValueCache(newRawValue);
    onChange({ field, value: newValue });
  };

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <InputAdorner disabled={ disabled } readonly={ readonly } pre={ prefixAdorner } post={ suffixAdorner }>
      <input
        ref={ numberInputRef }
        class={ classNames('fjs-input', { readonly }) }
        disabled={ disabled }
        id={ prefixId(id, formId) }

        // @ts-ignore
        onKeyPress={ onKeyPress }
        readonly={ readonly }
        onInput={ onInput }
        type="number"
        step={ appliedStep }
        value={ displayValue } />
    </InputAdorner>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Number.create = function(options = {}) {
  return {
    ...options
  };
};

Number.sanitizeValue = ({ value, formField }) => {

  const floatValue = parseFloat(value);
  if (isNaN(floatValue)) return null;

  const decimalDigits = parseInt(formField.decimalDigits);
  return isNaN(decimalDigits) ? floatValue : +floatValue.toFixed(decimalDigits);

};

Number.type = type;
Number.keyed = true;
Number.label = 'Number';
Number.emptyValue = null;