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

function getHeaderFilename (headers) {
  try {
    const rawFilename = headers.get('Content-Disposition').split('filename=')[1]
    return rawFilename.trim().slice(1, -1) // Removes "
  } catch (err) {
    return ''
  }
}

export default {
  isNumeric,
  isBoolean,
  isArray,
  isString,
  isUndefined,
  getHeaderFilename
}
