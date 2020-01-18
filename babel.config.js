module.exports = function getConfig(api) {
  api.cache(true)

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
  ]

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    'lodash',
    'date-fns',
  ]

  if (process.env.NODE_ENV === 'development') {
    plugins.push('react-hot-loader/babel')
  }

  const env = {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules: true,
          },
        ],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        'lodash',
        'date-fns',
      ],
    },
  }

  return {
    presets,
    plugins,
    env,
  }
}
