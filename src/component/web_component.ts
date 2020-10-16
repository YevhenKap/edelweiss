import { renderWebComponent } from '../dom/render';
import { alternation, promiseOf } from '@fluss/core';
import type { State } from '../state/state';

export default class WebComponent<T extends State = {}> extends HTMLElement {
  /**
   * Contains the rendering order. This property is similar to `renderOrder`
   * field in **render.ts** file. The property ensures that the rendering
   * will take place in the order in which the relevant functions are called.
   * But due to the fact that the Shadow DOM is updated only with changes
   * in the internal state, each instance of the custom element has its
   * own order of rendering.
   */
  #renderOrder: Promise<void> = promiseOf(undefined);
  #state: T = {} as T;

  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });

    this.#renderOrder = this.#renderOrder.then(() => renderWebComponent(this));
  }

  get state(): T {
    return this.#state;
  }

  changeState(parts: Partial<T>): Promise<void> {
    this.#state = {
      ...this.#state,
      ...parts,
    };

    return (this.#renderOrder = this.#renderOrder.then(() =>
      renderWebComponent(this)
    ));
  }

  template(): string | Promise<string> {
    return '';
  }
}

/** Defines custom element. */
export function defineWebComponent<T extends State>(
  tagName: string,
  elementClass: { new (): WebComponent<T>; prototype: WebComponent<T> }
): void {
  alternation(
    () => customElements.get(tagName),
    () => {
      customElements.define(tagName, elementClass);
    }
  )();
}
