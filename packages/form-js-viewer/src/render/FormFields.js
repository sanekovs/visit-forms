import { formFields } from './components';

export default class FormFields {
  constructor() {
    this._formFields = {};

    formFields.forEach((formField) => {
      this.register(formField.type, formField);
    });
  }

  register(type, formField) {
    this._formFields[ type ] = formField;
  }

  get(type) {
    return this._formFields[ type ];
  }
}