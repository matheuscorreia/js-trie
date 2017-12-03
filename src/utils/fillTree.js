// @flow

import Node from '../Node'

import type { NodeType } from '../Node'
import type { Operators } from '../main'

const fillTree = (operator: $ElementType<Operators, string>, root: NodeType): NodeType => {
  for (const k in operator) {
    put(root, k, Number(operator[k]), 0)
  }
  return root
};

const put = (root: NodeType, phone: string, price: ?number = null, d: number): void => {
  if(d === phone.length) return;

  const n = Number(phone.charAt(d))

  // if already has next number, use it, instead of creating a new one
  const node = root.children[n] || new Node(n.toString(), !phone.charAt(d+1) ? price : null);

  // if theres no next number node, set created one as child of this node
  // $FlowFixMe
  if(!root.children[n]) root.setChildren(root.children.pushIndex(n, node))

  put(node, phone, price, d+1)
}

export default fillTree
