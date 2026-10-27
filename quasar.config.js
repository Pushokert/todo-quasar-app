module.exports = function () {
  return {
    framework: {
      config: {},
      plugins: ['Notify', 'Dialog']
    },
    build: {
      vueRouterMode: 'hash',
      publicPath: process.env.VITE_BASE_URL || '/todo-quasar-app/',
      sourcemap: false,
      minify: true,
      uglifyOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      }
    },
    devServer: {
      open: false,
      port: 9000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  };
};
