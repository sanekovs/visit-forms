import { parser as feelersParser, buildSimpleTree, evaluate as evaluateFeelers } from 'feelers';
import { isString } from 'min-dash';
import { getFlavouredFeelVariableNames } from './variableExtractionHelpers';

export default class FeelersTemplating {

  constructor() { }

  /**
   * Determines if the given value is a feelers template.
   *
   * @param {any} value
   * @returns {boolean}
   *
   */
  isTemplate(value) { return isString(value) && (value.startsWith('=') || /{{.*?}}/.test(value)); }


  /**
   * Retrieve variable names from a given feelers template.
   *
   * @param {string} template
   *
   * @returns {string[]}
   */
  getVariableNames(template) {

    if (!this.isTemplate(template)) {
      return [];
    }

    const expressions = this._extractExpressionsWithDepth(template);
    const specialDepthAccessors = {
      parent: [ -1, 1 ],
      _parent_: [ -1 ],
      this: [ 0, 1 ],
      _this_: [ 0 ],
    };

    return expressions.reduce((variables, { expression, depth }) => {
      return [ ...variables, ...getFlavouredFeelVariableNames(expression, 'expression', { depth, specialDepthAccessors }) ];
    }, []);
  }


  /**
   * Evaluate a template.
   *
   * @param {string} template
   * @param {Object<string, any>} context
   * @param {Object} options
   * @param {boolean} [options.debug = false]
   * @param {boolean} [options.strict = false]
   * @param {Function} [options.buildDebugString]
   *
   * @returns
   */
  evaluate(template, context = {}, options = {}) {

    const {
      debug = false,
      strict = false,
      buildDebugString = (err) => ' {{⚠}} '
    } = options;

    return evaluateFeelers(template, context, { debug, strict, buildDebugString });
  }


  _extractExpressionsWithDepth(template) {

    // build simplified feelers syntax tree
    const parseTree = feelersParser.parse(template);
    const tree = buildSimpleTree(parseTree, template);

    return (function _traverse(n, depth = 0) {

      // detect all feel expressions in the tree
      if ([ 'Feel', 'FeelBlock' ].includes(n.name)) {
        return [ { depth, expression: n.content } ];
      }

      // increment depth for loop expressions to account for context mapping
      if (n.name === 'LoopSpanner') {
        const loopExpression = n.children[0].content;
        const childResults = n.children.slice(1).reduce((acc, child) => {
          return acc.concat(_traverse(child, depth + 1));
        }, []);
        return [ { depth, expression: loopExpression }, ...childResults ];
      }

      return n.children.reduce((acc, child) => {
        return acc.concat(_traverse(child, depth));
      }, []);

    })(tree);

  }
}

FeelersTemplating.$inject = [];