import * as utils from './utils.js'

function getDefaults() {
  return {
    handleEmptyResourcesAsFailed: true,
    cacheHitMode: 'none'
  }
}

function handleCorrectReadFunction(backend, language, namespace, resolver) {
  const fc = backend.read.bind(backend)
  if (fc.length === 2) {
    // no callback
    try {
      const r = fc(language, namespace)
      if (r && typeof r.then === 'function') {
        // promise
        r.then((data) => resolver(null, data)).catch(resolver)
      } else {
        // sync
        resolver(null, r)
      }
    } catch (err) {
      resolver(err)
    }
    return
  }

  // normal with callback
  fc(language, namespace, resolver)
}

class Backend {
  constructor(services, options = {}) {
    this.backends = []
    this.type = 'backend'

    this.init(services, options)
  }

  init(services, options = {}, i18nextOptions) {
    this.services = services
    this.options = utils.defaults(options, this.options || {}, getDefaults())

    this.options.backends && this.options.backends.forEach((b, i) => {
      this.backends[i] = this.backends[i] || utils.createClassOnDemand(b)
      this.backends[i].init(services, (this.options.backendOptions && this.options.backendOptions[i]) || {}, i18nextOptions)
    })
  }

  read(language, namespace, callback) {
    let bLen = this.backends.length

    const loadPosition = (pos) => {
      if (pos >= bLen) return callback(new Error('non of the backend loaded data', true)) // failed pass retry flag
      const isLastBackend = pos === bLen - 1
      const lengthCheckAmount = this.options.handleEmptyResourcesAsFailed && !isLastBackend ? 0 : -1

      const backend = this.backends[pos]
      if (backend.read) {
        handleCorrectReadFunction(backend, language, namespace, (err, data) => {
          if (!err && data && Object.keys(data).length > lengthCheckAmount) {
            callback(null, data, pos)
            savePosition(pos - 1, data) // save one in front
            if (backend.save && this.options.cacheHitMode && ['refresh', 'refreshAndUpdateStore'].indexOf(this.options.cacheHitMode) > -1) {
              const nextBackend = this.backends[pos + 1]
              if (nextBackend && nextBackend.read) {
                handleCorrectReadFunction(nextBackend, language, namespace, (err, data) => {
                  if (err) return
                  if (!data) return
                  if (Object.keys(data).length <= lengthCheckAmount) return
                  savePosition(pos, data)
                  if (this.options.cacheHitMode !== 'refreshAndUpdateStore') return
                  if (this.services && this.services.resourceStore) {
                    this.services.resourceStore.addResourceBundle(language, namespace, data)
                  }
                })
              }
            }
          } else {
            loadPosition(pos + 1) // try load from next
          }
        })
      } else {
        loadPosition(pos + 1) // try load from next
      }
    }

    const savePosition = (pos, data) => {
      if (pos < 0) return

      const backend = this.backends[pos]
      if (backend.save) {
        backend.save(language, namespace, data)
        savePosition(pos - 1, data)
      } else {
        savePosition(pos - 1, data)
      }
    }

    loadPosition(0)
  }


  create(languages, namespace, key, fallbackValue, clb = () => {}, opts = {}) {
    this.backends.forEach(b => {
      if (!b.create) return

      const fc = b.create.bind(b)
      if (fc.length < 6) {
        // no callback
        try {
          let r
          if (fc.length === 5) { // future callback-less api for i18next-locize-backend
            r = fc(languages, namespace, key, fallbackValue, opts)
          } else {
            r = fc(languages, namespace, key, fallbackValue)
          }
          if (r && typeof r.then === 'function') {
            // promise
            r.then((data) => clb(null, data)).catch(clb)
          } else {
            // sync
            clb(null, r)
          }
        } catch (err) {
          clb(err)
        }
        return
      }

      // normal with callback
      fc(languages, namespace, key, fallbackValue, clb /* unused callback */, opts)
    })
  }
}

Backend.type = 'backend'

export default Backend
