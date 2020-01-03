const path = require('path')
process.env.NODE_ENV = 'development'

const config = {
  root: true,
  plugins: ['react', 'node', 'security', 'babel', 'react-hooks'],
  extends: ['airbnb'],
  env: {
    node: true,
    es6: true
  },
  globals: {
    it: true,
    expect: true,
    describe: true,
    jest: true,
    document: true,
    test: true,
    window: true,
    fetch: true,
    WebSocket: true,
    alert: true,
    Blob: true,
    URL: true,
    localStorage: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    parser: 'babel-eslint',
  },
  rules: {
    // DISABLED
    semi: ['error', 'never'],
    'global-require': 'off',
    'linebreak-style': 'off',
    'max-len': 'off',
    'no-sequences': 'off',
    'no-mixed-operators': 'off',
    'radix': 'off',
    'camelcase': 'off',
    'one-var': 'off',
    'one-var-declaration-per-line': 'off',
    'function-paren-newline': 'off',
    'prefer-template': 'off',
    'react/no-danger': 'off',
    'react/prop-types': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/prefer-stateless-function': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-max-props-per-line': 'off',
    'object-property-newline': 'off',
    'object-curly-newline': 'off',
    'class-methods-use-this': 'off',
    'padded-blocks': 'off',
    // uncomment when we`ll desire to improve such accessibility:
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    //
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/href-no-hash': 'off', // we do not want to receive such msg from markup folder
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': ['error', {
      // these are files that can import dev dependencies. anywhere else will
      // result in an error. using this list instead of the airbnb list which
      // doesn't cover most of our codebase correctly
      devDependencies: [
        // 'images/**/*',
        'config/**/*',
        'scripts/**/*',
        'test/**', // tape, common npm pattern
        '**/*.test.js', // tests where the extension denotes that it is a test
        '**/*.test.jsx', // tests where the extension denotes that it is a test
      ],
      optionalDependencies: false,
    }],

    // New Eslint or Airbnb rules ----
    'react/jsx-curly-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-multi-comp': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-wrap-multilines': ['warn', {
      return: 'parens-new-line',
      arrow: 'parens-new-line',
    }],
    'operator-linebreak': ['warn', 'before', { 'overrides': { '&&': 'after' } }],
    // -------------------------------

    // WARNINGS
    'prefer-destructuring': 'warn',
    'comma-dangle': 'warn',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    'no-console': 'off', // 'warn',
    'no-unused-vars': 'warn',
    'no-unreachable': 'warn',
    'spaced-comment': 'warn',
    'react/sort-comp': 'warn',
    'react/no-unused-state': 'warn',
    'jsx-quotes': ['warn', 'prefer-single'],
    'react/jsx-no-bind': ['warn', {
      'ignoreRefs': true,
      'allowArrowFunctions': false,
      'allowFunctions': false,
      'allowBind': false,
    }],
    'react/jsx-fragments': ['warn', 'element'],
    'react/state-in-constructor': ['warn', 'never'],


    'react/no-deprecated': 'warn',
    'react/jsx-props-no-spreading': 'off', // needed to cascade styles for Blueprint components

    // ENABLED
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'quote-props': ['error', 'consistent-as-needed'],
    // its annoying when it triggers in .reduce() and others std cases
    'no-param-reassign': ['error', { props: false }],
  },
  settings: {
    'import/external-module-folders': ['node_modules'],
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, './config/webpack.config.dev.js')
      },
    }
  }
}

module.exports = config
