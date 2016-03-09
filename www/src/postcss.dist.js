module.exports = {
  'use': [
    "postcss-import",
    "postcss-simple-vars",
    "postcss-nested",
    "postcss-calc",
    "autoprefixer"
  ],
  'autoprefixer': {
    'browsers': '> 5%'
  },
  'csswring': {},
  'postcss-nested': {},
  'postcss-simple-vars': {},
  'postcss-import': {
    glob: true
  }
};