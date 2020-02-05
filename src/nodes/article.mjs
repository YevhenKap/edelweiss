// @flow

import type { Attributes, Nodes, ENodeEventListenersObject } from './en.mjs'

import ENode from './en.mjs'

/**
 * Construct **<article>** node with specific options.
 */
export default class Article extends ENode {
  constructor(children?: Nodes, attributes?: Attributes, listeners?: ENodeEventListenersObject) {
    super('article', {
      children,
      attributes,
      listeners
    })
  }
}
