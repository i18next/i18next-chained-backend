import expect from 'expect.js'
import Backend from '../index.js'

// i18next >= 26.7: a declared calling convention, also for the chained backends, and
// services.utils.reloadResources for reload()
describe('chained backend with i18next 26.7', () => {
  it('declares the callback form', () => {
    expect(Backend.callbackApi).to.be(true)
  })

  it("follows an inner backend's callbackApi instead of its number of parameters", async () => {
    const created = []
    const promiseBackend = {
      init () {},
      callbackApi: false,
      read: (language, namespace, unused) => Promise.resolve({ from: 'promise' })
    }
    const callbackBackend = {
      init () {},
      callbackApi: true,
      read (language, namespace, callback) { callback(null, {}) },
      // defaults make Function.length 4, which the guess calls without the options
      create (languages, namespace, key, fallbackValue, clb = () => {}, opts = {}) { created.push(opts.isUpdate) }
    }
    const backend = new Backend({}, { backends: [promiseBackend, callbackBackend] })
    const data = await new Promise((resolve, reject) =>
      backend.read('en', 'translation', (err, d) => (err ? reject(err) : resolve(d))))
    expect(data).to.eql({ from: 'promise' })
    backend.create(['en'], 'translation', 'key', 'value', () => {}, { isUpdate: true })
    expect(created).to.eql([true])
  })

  it('reloads through services.utils.reloadResources when i18next provides it', () => {
    const calls = []
    const backend = new Backend()
    backend.services = {
      backendConnector: {},
      languageUtils: { toResolveHierarchy: (lng) => (lng ? [lng] : ['en']) },
      utils: { reloadResources: (lngs, ns) => calls.push([lngs, ns]) }
    }
    backend.allOptions = { ns: ['translation'], preload: ['de'] }
    backend.reload()
    expect(calls).to.eql([[['en', 'de'], ['translation']]])
  })
})
