function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function isBoolean (b) {
  return typeof b === 'boolean'
}

function isArray (a) {
  return Object.prototype.toString.call(a) === '[object Array]'
}

function isString (s) {
  return typeof s === 'string' || s instanceof String
}

function isUndefined (u) {
  return u === undefined
}

export default {
  isNumeric,
  isBoolean,
  isArray,
  isString,
  isUndefined
}
