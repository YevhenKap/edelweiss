/* eslint-disable import/no-absolute-path */
// @flow

import {
  group,
  test,
  expect,
} from '/node_modules/@prostory/baum/dist/index.mjs'

import { Component, html } from '../../dist/index.mjs'

group('Test "Component"', () => {
  return [
    test('Component.template() returns Promise<string>', async () => {
      class TestComponent extends Component {
        template() {
          return html`Test`
        }
      }

      const component = new TestComponent()
      expect(component.template()).toBe('Promise')
      ;(await expect(component.template()).toBeResolved()).toEqual('Test')
    }),

    test('Component.beforeBuild() invokes before template is builded', async () => {
      class TestComponent extends Component {
        beforeBuild() {
          this.name = 'TestComponent'
        }

        template() {
          return html`Test ${this.name}`
        }
      }

      const component = new TestComponent()
      ;(await expect(component._createNodes()).toBeResolved()).toEqual(
        'Test TestComponent'
      )
    }),
  ]
})