// @flow

import type { Attributes, Nodes, ENodeEventListenersObject } from './en.mjs'

import ENode from './en.mjs'

/**
 * Construct **<table>** node with specific options.
 */
export default class Table extends ENode {
  constructor(children?: Nodes, attributes?: Attributes, listeners?: ENodeEventListenersObject) {
    super('table', {
      children,
      attributes,
      listeners
    })
  }
}
