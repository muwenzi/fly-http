import Fly from './src/Fly.browser'

const createInstanceMethods = [
  'path',
  'p',
  'pathRaw',
  'beforeSend',
  'query',
  'q',
  'queryAll',
  'header',
  'contentType',
  'withText',
  'withJson',
  'accept',
  'asText',
  'asXML',
  'asFormattedResponse',
  'cache',
  'append'
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

export default createInstance()
