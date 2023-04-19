import {
  getSchemaVariables
} from '../../../src';

import schema from '../form.json';
import dynamicSchema from '../dynamic.json';
import conditionalSchema from '../condition-external-variable.json';
import expressionSchema from '../expression-external-variable.json';
import templateSchema from '../template-variable.json';
import complexTemplateSchema from '../template-variable-complex.json';

describe('util/getSchemaVariables', () => {

  it('should include form field keys', () => {

    const variables = getSchemaVariables(schema);

    expect(variables).to.eql([ 'creditor', 'invoiceNumber', 'amount', 'approved', 'approvedBy', 'approverComments', 'product', 'mailto', 'language', 'conversation', 'tags' ]);

  });


  it('should include values formfields valuesKeys', () => {

    const variables = getSchemaVariables(dynamicSchema);

    expect(variables).to.eql([ 'product', 'xyzData', 'mailto', 'language', 'tags' ]);

  });


  it('should NOT include values formfields valuesKeys when requesting output vars', () => {

    const variables = getSchemaVariables(dynamicSchema, { direction: 'output' });

    expect(variables).to.eql([ 'product', 'mailto', 'language', 'tags' ]);
  });


  it('should include variables in conditions', () => {

    const variables = getSchemaVariables(conditionalSchema);

    expect(variables).to.eql([ 'amount', 'externalVariable' ]);
  });


  it('should NOT include variables in conditions when requesting output vars', () => {

    const variables = getSchemaVariables(conditionalSchema, { direction: 'output' });

    expect(variables).to.eql([ 'amount' ]);
  });


  it('should include variables in expressions', () => {

    const variables = getSchemaVariables(expressionSchema);

    expect(variables).to.eql([ 'logo', 'alt', 'myText' ]);
  });


  it('should NOT include variables in expressions when requesting output vars', () => {

    const variables = getSchemaVariables(expressionSchema, { direction: 'output' });

    expect(variables).to.eql([]);
  });


  it('should include variables in root of templates', () => {

    const variables = getSchemaVariables(templateSchema);

    expect(variables).to.eql([ 'myText', 'greeting', 'name', 'showAge', 'age', 'hobbies' ]);
  });


  it('should handle complex template cases', () => {

    const variables = getSchemaVariables(complexTemplateSchema);

    expect(variables).to.eql([ 'value', 'minimum', 'display', 'orgs', 'external1', 'external2', 'parent', 'this' ]);
  });


  it('should NOT include variables - no expression', () => {

    const variables = getSchemaVariables(expressionSchema);

    expect(variables).to.not.have.members([ 'This', 'is', 'just', 'an', 'image' ]);
  });

});