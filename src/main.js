/** @flow */

// $FlowFixMe
Array.prototype.pushIndex = function (index: number, value: any) {
  return [...this.slice(0, index), value, ...this.slice(index + 1)]
}

import fs from 'fs'
import path from 'path'
import invariant from 'invariant'
import { argv } from 'yargs'
import treeify from 'treeify'

import Node from './Node'
import type { NodeType, TraverseBag, Match } from './Node'
import fillTree from './utils/fillTree'

export type Operators = {
  [string]: {
    [string]: string,
  }
}

export type OperatorsTrees = {
  [string]: NodeType,
}

const { phone, operators, showTree } = argv

invariant(phone, 'You must provide a phone number to be tested');
invariant(typeof phone === 'number', '\'phone\' must be of type number');
invariant(operators, 'You must provide a path to the operators JSON file');
invariant(typeof operators === 'string', '\'operators\' must be of type string');

const op: Operators = JSON.parse(fs.readFileSync(operators, 'utf8'))

// start Trie structures from operators files
const operatorsTrees: OperatorsTrees = {};
for (const k in op) {
  operatorsTrees[k] = fillTree(op[k], new Node())
}

// For development use:
// console.log(treeify.asTree(operatorsTrees, true, true))

//  TODO: FIX THIS. From this line to the end
const maxLengthReducer = (maxLength: number, v: Match) => v.prefix.length > maxLength ? v.prefix.length : maxLength;
const minPriceMatchReducer = (a: Match, v: Match) => v.node.price < a.node.price ? v : a;

const result: { [string]: Match } = {}
for(const k in operatorsTrees) {
  const treeMatch = operatorsTrees[k].search(phone.toString());

  const maxPrefixLength = treeMatch.reduce(maxLengthReducer, 0)
  const longestPrefixMatches = treeMatch.filter(v => v.prefix.length === maxPrefixLength);
  result[k] = longestPrefixMatches.reduce(minPriceMatchReducer);
}

let lowestPriceOperator: ?Match = null;
for (const k in result) {
  if(!lowestPriceOperator || result[k].node.price < lowestPriceOperator.node.price) {
    lowestPriceOperator = result[k]
    lowestPriceOperator.operator = k;
  }
}

console.info("banana")

const { operator, node, prefix } = lowestPriceOperator

console.log(`The number provided (${phone}) will pay the lowest amount($ ${node.price}/min) using prefix code ${prefix} on operator ${operator}`)
