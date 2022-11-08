import {
  DateTimeDisplayEntry
} from '../entries';


export default function DisplayGroup(field, editField) {

  const entries = [
    ...DateTimeDisplayEntry({ field, editField })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'display',
    label: 'Display',
    entries
  };
}