import FormGeneration from './components/FormGeneration.js';

export default class FormGenerationUI {
  constructor(renderInjector) {
    renderInjector.attachRenderer('formGenerationUI', FormGeneration);
  }
}