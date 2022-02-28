// svgo.config.js
module.exports = {
  js2svg: {
    indent: 2,
    pretty: true,
  },
  plugins: [
    require('./svg-template.js')
  ],
};
