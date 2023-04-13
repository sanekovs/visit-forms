import { parseExpressions, parseUnaryTests } from 'feelin';

export const getFlavouredFeelVariableNames = (feelString, feelFlavour, options = {}) => {

  const {
    depth = 0,
    specialDepthAccessors = {}
  } = options;

  if (![ 'expression', 'unaryTest' ].includes(feelFlavour)) return [];

  const tree = feelFlavour === 'expression' ? parseExpressions(feelString) : parseUnaryTests(feelString);

  const simpleExpressionTree = _buildSimpleFeelStructureTree(tree, feelString);

  return (function _unfoldVariables(node) {

    if (node.name === 'PathExpression') {

      if (Object.keys(specialDepthAccessors).length === 0) {
        return depth === 0 ? [ _getVariableNameAtPathIndex(node, 0) ] : [ ];
      }

      // if using special depth accessors, use a more complex extraction
      return [ ..._smartExtractVariableNames(node, depth, specialDepthAccessors) ];
    }

    if (depth === 0 && node.name === 'VariableName') return [ node.variableName ];

    // for any other kind of node, traverse its children and flatten the result
    if (node.children) {
      return node.children.reduce((acc, child) => {
        return acc.concat(_unfoldVariables(child));
      }, []);
    }

    return [];
  })(simpleExpressionTree);

};


/**
 * Get the variable name at the specified index in a given path expression.
 *
 * @param {Object} root - The root node of the path expression tree.
 * @param {number} index - The index of the variable name to retrieve.
 * @returns {string|null} The variable name at the specified index or null if index is out of bounds.
 */
const _getVariableNameAtPathIndex = (root, index) => {
  const parts = _deconstructPathExpression(root);
  return parts[index] || null;
};


/**
 * Extracts variable names from a given node based on depth and special depth accessors.
 *
 * @param {Object} node - The node to extract variable names from.
 * @param {number} initialDepth - The initial depth to start searching for variables.
 * @param {Object} specialDepthAccessors - An object containing special depth accessor mappings.
 * @returns {Set} - A set containing the extracted variable names.
 */
const _smartExtractVariableNames = (node, initialDepth, specialDepthAccessors) => {

  // double brackets are needed as set constructor unpacks the first layer of the array
  let currentDepthInfos = new Set([ [ -999, initialDepth - 1 ] ]);
  const extractedVariables = new Set();
  const nodeParts = _deconstructPathExpression(node);

  for (let i = 0; i < nodeParts.length; i++) {
    const currentPart = nodeParts[i];

    if (currentPart in specialDepthAccessors) {
      const depthOffsets = specialDepthAccessors[currentPart];

      currentDepthInfos = new Set(
        depthOffsets.reduce((accumulator, offset) => {
          return [
            ...accumulator,
            ...[ ...currentDepthInfos ].map(depthInfo => [ depthInfo[1], depthInfo[1] + offset ]),
          ];
        }, []).filter(depthInfo => depthInfo[1] >= -1)
      );
    } else {
      currentDepthInfos = new Set([ ...currentDepthInfos ].map(depthInfo => [ depthInfo[1], depthInfo[1] + 1 ]));
    }

    // if any child accesses from the root, we know the variable is required from the external context
    if ([ ...currentDepthInfos ].some(depthInfo => depthInfo[0] === -1 && depthInfo[1] === 0)) {
      extractedVariables.add(currentPart);
    }
  }

  return extractedVariables;
};


/**
 * Deconstructs a path expression tree into an array of components.
 *
 * @param {Object} root - The root node of the path expression tree.
 * @returns {Array<string>} An array of components in the path expression, in the correct order.
 */
const _deconstructPathExpression = (root) => {

  let node = root;
  let parts = [];

  // Traverse the tree and collect path components
  while (node.name === 'PathExpression') {
    parts.push(node.children[1].variableName);
    node = node.children[0];
  }

  // Add the last component to the array
  parts.push(node.variableName);

  // Reverse and return the array to get the correct order
  return parts.reverse();
};


// Unpack the parse tree into a simple tree structure
const _buildSimpleFeelStructureTree = (parseTree, feelString) => {

  const stack = [ { children: [] } ];
  parseTree.iterate({
    enter: (node) => {

      const nodeRepresentation = {
        name: node.type.name,
        children: [],
      };

      if (node.type.name === 'VariableName') {
        nodeRepresentation.variableName = feelString.slice(node.from, node.to);
      }

      stack.push(nodeRepresentation);
    },
    leave: () => {
      const result = stack.pop();
      const parent = stack[stack.length - 1];
      parent.children.push(result);
    }
  });

  return stack[0].children[0];
};