import { attachEvents } from '../utils/dom';
import { promiseOf, alternation, arrayFrom } from '@fluss/core';
import { appendNodes, querySelector, createElement } from '@fluss/web';

export default class WebComponent extends HTMLElement {
  constructor() {
    super();
  }

  // Rendering in connectedCallback, not in constructor,
  // because the browser did not yet process/assign attributes at constructor stage.
  connectedCallback() {
    const shadow = this.attachShadow({
      mode: 'open',
    });

    promiseOf(this.template()).then((html) => {
      const clonedHTML = document.importNode(prepareHTML(html).content, true);

      /**
       * Custom element in Shadow DOM don't differs as usual DOM nodes,
       * so we don't need to detach event listeners.
       */
      arrayFrom(clonedHTML.children).forEach((element) =>
        attachEvents(element, false)
      );

      appendNodes(shadow, clonedHTML);
    });
  }

  template(): string | Promise<string> | HTMLTemplateElement {
    return '';
  }
}

/** Defines custom element. */
export function defineWebComponent(
  tagName: string,
  elementClass: { new (): WebComponent; prototype: WebComponent }
): void {
  alternation(
    () => customElements.get(tagName),
    () => {
      customElements.define(tagName, elementClass);
    }
  )();
}

function prepareHTML(html: string | HTMLElement): HTMLTemplateElement {
  const wrapperElement = createElement('div')
    .map((div) => {
      typeof html === 'string'
        ? (div.innerHTML = html)
        : appendNodes(div, html);
      return div;
    })
    .extract();

  return (
    querySelector('template', wrapperElement).extract() ||
    /**
     * Template element must be directly defined in HTML.
     * Content can't be added to it in JS.
     * So function returns empty element as fallback.
     */
    createElement('template').extract()
  );
}