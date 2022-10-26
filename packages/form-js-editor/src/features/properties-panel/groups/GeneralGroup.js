import {
  ActionEntry,
  ColumnsEntry,
  ConditionEntry,
  DescriptionEntry,
  DefaultValueEntry,
  DisabledEntry,
  IdEntry,
  KeyEntry,
  LabelEntry,
  TextEntry
} from '../entries';


export default function GeneralGroup(field, editField) {

  const entries = [
    ...IdEntry({ field, editField }),
    ...LabelEntry({ field, editField }),
    ...DescriptionEntry({ field, editField }),
    ...KeyEntry({ field, editField }),
    ...DefaultValueEntry({ field, editField }),
    ...ActionEntry({ field, editField }),
    ...ColumnsEntry({ field, editField }),
    ...TextEntry({ field, editField }),
    ...DisabledEntry({ field, editField }),
    ...ConditionEntry({ field, editField })
  ];

  return {
    id: 'general',
    label: 'General',
    entries
  };
}