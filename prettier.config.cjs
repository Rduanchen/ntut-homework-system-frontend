module.exports = {
  // keep lines reasonably wide for templates and long Vue expressions
  printWidth: 100,

  // match common Vue + Vuetify style (2 spaces)
  tabWidth: 2,
  useTabs: false,

  // prefer semicolons (matches most eslint configs)
  semi: true,

  // prefer single quotes for JS/TS and JSX in Vue SFCs
  singleQuote: true,
  jsxSingleQuote: true,

  // trailing commas where valid in ES5 (helps diffs)
  trailingComma: 'es5',

  // object spacing
  bracketSpacing: true,

  // avoid parentheses around single-arg arrow functions where possible
  arrowParens: 'avoid',

  // preserve prose wrapping decisions (e.g. in markdown)
  proseWrap: 'preserve',

  // consistent line endings
  endOfLine: 'lf',

  // respect html/css whitespace rules for Vue templates
  htmlWhitespaceSensitivity: 'css',

  // important for Vue SFC: indent <script> and <style> blocks
  vueIndentScriptAndStyle: true,
}
