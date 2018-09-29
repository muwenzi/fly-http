export function isNumeric (value) {
  return !isNaN(parseFloat(value) && isFinite(value))
}

export function isBoolean (value) {
  return typeof value === 'boolean'
}

export function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

export function isString (value) {
  return typeof value === 'string'
}

export function isUndefined (value) {
  return value === undefined
}

export function isObject (value) {
  return value === Object(value)
}

export function isEmpty (value) {
  return value == null || !(Object.keys(value) || value).length
}

export function isValidJSON (obj) {
  try {
    JSON.parse(obj)
    return true
  } catch (e) {
    return false
  }
}

export function isPrimitive (value) {
  return !['object', 'function'].includes(typeof value) || value === null
}

export function getHeaderFilename (headers) {
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
  isObject,
  isEmpty,
  isValidJSON,
  isPrimitive,
  getHeaderFilename
}
