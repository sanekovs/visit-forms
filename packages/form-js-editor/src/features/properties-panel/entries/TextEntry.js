import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelTemplatingEntryEdited } from '@bpmn-io/properties-panel';


export default function TextEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  if (type !== 'text') {
    return [];
  }

  return [
    {
      id: 'text',
      component: Text,
      editField: editField,
      field: field,
      isEdited: isFeelTemplatingEntryEdited
    }
  ];
}

function Text(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'text' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    description: 'Use an Expression, a Template, or plain text.\nRenders Markdown and HTML.',
    element: field,
    getValue,
    id,
    label: 'Text',
    setValue,
    variables
  });
}