// @flow

export type Styles = { [string]: number | string } | string

export type CssDeclaration =
  | string
  | { relativeTo: string, cssFilePath: string }

/**
 * Convert object of styles or string in inline CSS. It must be a valid CSS expressions (not camelCase).
 */
export function normalizeStyles(styles: Styles): string {
  const stringStyles =
    typeof styles !== 'string' ? JSON.stringify(styles) : styles
  return stringStyles.replace(/,(?![\s\d])/g, ';').replace(/[{}"']/g, '')
}

/**
 * Loads CSS file by adding <link> to <head>.
 */
export function loadCSS(declaration: CssDeclaration): void {
  const normalizedPath = buildCssPath(declaration)

  if (document.head) {
    const oldLinkElement = document.head.querySelector(
      `link[href="${normalizedPath}"]`
    )

    if (!oldLinkElement) {
      const linkElement = document.createElement('link')
      linkElement.setAttribute('rel', 'stylesheet')
      linkElement.setAttribute('href', normalizedPath)

      // $FlowFixMe - querySelector doesn't change the head element.
      document.head.append(linkElement)
    }
  }
}

function buildCssPath(declaration: CssDeclaration): string {
  return typeof declaration === 'string'
    ? declaration
    : buildCssPathFromObject(declaration)
}

function buildCssPathFromObject(declaration: {
  relativeTo: string,
  cssFilePath: string,
}): string {
  const { relativeTo, cssFilePath } = declaration

  const rootPathToArray = relativeTo
    .replace(/([\w\d-]+)\.[\w]{2,4}$/, '') // Remove filename (end) if exists
    .match(/(\/([\w\d_-])*)+$/) // Get path as directory without trailing "/"

  if (rootPathToArray) {
    const normalizedPathSegments: string[] = []

    const [rootPathTo] = rootPathToArray

    const reversedPathSplitted = cssFilePath.split('/').reverse()
    const rootPathToSplitted = rootPathTo.split('/')

    reversedPathSplitted.forEach(segment => {
      if (segment === '..') {
        rootPathToSplitted.pop()
      } else {
        if (segment !== '.') {
          normalizedPathSegments.unshift(segment)
        }
      }
    })

    return `${rootPathToSplitted.join('/')}${normalizedPathSegments.join('/')}`
  } else {
    console.error(
      `CSS file's path cannot be computed relative to ${relativeTo}.
      So empty path is returned.`
    )
    return ''
  }
}
