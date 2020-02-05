// @flow

import type { Attributes, Nodes, ENodeEventListenersObject } from './en.mjs'

import ENode from './en.mjs'

/**
 * Construct **<picture>** node with specific options.
 */
export default class Picture extends ENode {
  constructor(children?: Nodes, attributes?: Attributes, listeners?: ENodeEventListenersObject) {
    super('picture', {
      children,
      attributes,
      listeners
    })
  }
}
