import expect from 'expect.js'
import { defaults } from '../src/utils.js'

describe('utils.defaults', () => {
  afterEach(() => {
    delete Object.prototype.polluted
  })

  it('ignores a __proto__ key carried by a JSON-parsed source', () => {
    const target = {}
    defaults(target, JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}'))
    expect(target.ok).to.be(1)
    expect(({}).polluted).to.be(undefined)
    expect(Object.getPrototypeOf(target)).to.be(Object.prototype)
  })

  it('does not copy inherited properties from an already-polluted prototype', () => {
    Object.prototype.polluted = 'yes' // eslint-disable-line no-extend-native
    const target = defaults({}, { ok: 1 })
    expect(Object.prototype.hasOwnProperty.call(target, 'polluted')).to.be(false)
  })

  it('copies into a null-prototype target without picking up prototype keys', () => {
    const target = Object.create(null)
    defaults(target, JSON.parse('{"__proto__": {"polluted": true}, "ok": 1}'))
    expect(target.ok).to.be(1)
    expect(target.__proto__).to.be(undefined) // eslint-disable-line no-proto
  })

  it('still merges normal options as before', () => {
    expect(defaults({ a: 1 }, { a: 9, b: 2 }, { c: 3 })).to.eql({ a: 1, b: 2, c: 3 })
  })
})
