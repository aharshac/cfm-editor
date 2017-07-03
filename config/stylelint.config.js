module.exports = {
  extends: [
    "stylelint-config-css-modules"
  ],
  rules: {
    // only prevent user errors
    "string-no-newline": true,
    "unit-no-unknown": true,
    "property-no-unknown": true,
    "declaration-block-no-duplicate-properties": [true, { "ignore": ["consecutive-duplicates-with-different-values"] }]
  }
}
