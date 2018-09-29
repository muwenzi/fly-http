import Fly from './src/FlyBrowser'

const createInstanceMethods = [
  'path',
  'p',
  'pathRaw',
  'beforeSend',
  'query',
  'q',
  'queryAll',
  'header',
  'auth',
  'contentType',
  'withText',
  'withJson',
  'accept',
  'asText',
  'asXML',
  'enrichResponse',
  'cache',
  'append',
  'formData',
  'formUrl',
  'credentials'
]

const createInstance = () => {
  const fly = () => new Fly()
  for (const method of createInstanceMethods) {
    fly[method] = (...theArgs) => {
      const instance = new Fly()
      instance[method](...theArgs)
      return instance
    }
  }
  return fly
}

export const clearCache = Fly.clearCache

export default createInstance()
