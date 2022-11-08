import { CheckboxEntry, isCheckboxEntryEdited } from '@bpmn-io/properties-panel';

import { DATETIME_SUBTYPES, TIME_USE24H_PATH } from '@bpmn-io/form-js-viewer';

import { get } from 'min-dash';

export default function DateTimeDisplayEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    type,
    subtype
  } = field;

  if (type !== 'datetime') {
    return [];
  }

  const entries = [];

  if (subtype === DATETIME_SUBTYPES.TIME || subtype === DATETIME_SUBTYPES.DATETIME) {

    entries.push({
      id: id + '-use24h',
      component: Use24h,
      isEdited: isCheckboxEntryEdited,
      editField,
      field
    });

  }

  return entries;
}

function Use24h(props) {
  const {
    editField,
    field,
    id
  } = props;

  const path = TIME_USE24H_PATH;

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return CheckboxEntry({
    element: field,
    getValue,
    id,
    label: 'Use 24h',
    setValue
  });
}