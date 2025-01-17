/**
 * @see https://github.com/mswjs/interceptors/issues/7
 */
import { createInterceptor } from '../../src'
import { interceptXMLHttpRequest } from '../../src/interceptors/XMLHttpRequest'
import { createXMLHttpRequest } from '../helpers'

const interceptor = createInterceptor({
  modules: [interceptXMLHttpRequest],
  resolver(request) {
    // Explicitly empty request middleware so that all requests
    // are bypassed (performed as-is).
  },
})

beforeAll(() => {
  interceptor.apply()
})

afterAll(() => {
  interceptor.restore()
})

test('handles XMLHttpRequest timeout via ontimeout callback', async () => {
  expect.assertions(1)

  await createXMLHttpRequest((req) => {
    req.open('GET', 'http://httpbin.org/get?userId=123', true)
    req.timeout = 1
    req.addEventListener('timeout', function () {
      expect(this.readyState).toBe(4)
    })
  })
})

test('handles XMLHttpRequest timeout via event listener', async () => {
  expect.assertions(1)

  await createXMLHttpRequest((req) => {
    req.open('GET', 'http://httpbin.org/get?userId=123', true)
    req.timeout = 1
    req.addEventListener('timeout', function () {
      expect(this.readyState).toBe(4)
    })
  })
})
