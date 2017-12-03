// @flow

export type NodeType = {
	num: string,
	children: Array<NodeType>,
  price: ?number,
  setChildren: (Array<?NodeType>) => void,
  search: (string) => TraverseBag,
}

export type Match = {
  prefix: string,
  node: NodeType,
}

export type TraverseBag = Array<Match>

const Node = function (
  num: ?string = null,
  price: ?number = null,
  children: ?Array<?NodeType> = Array(10).fill(null),
): NodeType {

	this.num = num
	this.children = children
  this.price = price

  this.setChildren = function (children: Array<?NodeType>): void {
    this.children = children
  }

  this.search = (phone: string): TraverseBag => this.getNode(phone, [], 0);

  this.getNode = (phone: string, matches: TraverseBag, d: number): TraverseBag => {
    if (this.price !== null) matches.push({ prefix: phone.slice(0, d), node: this });

    const n = Number(phone.charAt(d));

    if(!this.children[n]) return matches;

    return this.children[n].getNode(phone, matches, d+1)
  }

  return this;
}

export default Node
