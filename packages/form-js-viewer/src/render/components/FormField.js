import { useCallback, useContext, useEffect, useMemo } from 'preact/hooks';

import { get } from 'min-dash';

import { FormRenderContext } from '../context';

import useService from '../hooks/useService';
import { useCondition } from '../hooks';

import { findErrors } from '../../util';

import { gridColumnClasses } from './Util';

const noop = () => false;


export default function FormField(props) {
  const {
    field,
    onChange
  } = props;

  const { _path } = field;

  const formFields = useService('formFields'),
        viewerCommands = useService('viewerCommands', false),
        form = useService('form');

  const {
    initialData,
    data,
    errors,
    properties
  } = form._getState();

  const {
    Element,
    Empty,
    Column
  } = useContext(FormRenderContext);

  const FormFieldComponent = formFields.get(field.type);

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${field.type}>`);
  }

  const initialValue = useMemo(() => get(initialData, _path), [ initialData, _path ]);

  const value = get(data, _path);

  const fieldErrors = findErrors(errors, _path);

  const disabled = properties.readOnly || field.disabled || false;

  const onBlur = useCallback(() => {
    if (viewerCommands) {
      viewerCommands.updateFieldValidation(field, value);
    }
  }, [ viewerCommands, field, value ]);

  useEffect(() => {
    if (viewerCommands && initialValue) {
      viewerCommands.updateFieldValidation(field, initialValue);
    }
  }, [ viewerCommands, field, initialValue ]);

  const hidden = useCondition(field.conditional && field.conditional.hide || null);

  if (hidden) {
    return <Empty />;
  }

  return (
    <Column field={ field } class={ gridColumnClasses(field) }>
      <Element class="fjs-element" field={ field }>
        <FormFieldComponent
          { ...props }
          disabled={ disabled }
          errors={ fieldErrors }
          onChange={ disabled ? noop : onChange }
          onBlur={ disabled ? noop : onBlur }
          value={ value } />
      </Element>
    </Column>
  );
}
