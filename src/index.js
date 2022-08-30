import * as utils from './utils.js';

function getDefaults() {
  return {
    handleEmptyResourcesAsFailed: true
  };
}

class Backend {
  constructor(services, options = {}) {
    this.backends = [];
    this.type = 'backend';

    this.init(services, options);
  }

  init(services, options = {}, i18nextOptions) {
    this.services = services;
    this.options = utils.defaults(options, this.options || {}, getDefaults());

    this.options.backends && this.options.backends.forEach((b, i) => {
      this.backends[i] = this.backends[i] || utils.createClassOnDemand(b);
      this.backends[i].init(services, (this.options.backendOptions && this.options.backendOptions[i]) || {}, i18nextOptions);
    })
  }

  read(language, namespace, callback) {
    let bLen = this.backends.length;

    const loadPosition = (pos) => {
      if (pos >= bLen) return callback(new Error('non of the backend loaded data;', true)); // failed pass retry flag
      const isLastBackend = pos === bLen - 1;
      const lengthCheckAmount = this.options.handleEmptyResourcesAsFailed && !isLastBackend ? 0 : -1;

      const backend = this.backends[pos];
      if (backend.read) {
        backend.read(language, namespace, (err, data) => {
          if (!err && data && Object.keys(data).length > lengthCheckAmount) {
            callback(null, data, pos);
            savePosition(pos - 1, data); // save one in front
          } else {
            loadPosition(pos + 1); // try load from next
          }
        });
      } else {
        loadPosition(pos + 1); // try load from next
      }
    }

    const savePosition = (pos, data) => {
      if (pos < 0) return;

      const backend = this.backends[pos];
      if (backend.save) {
        backend.save(language, namespace, data);
        savePosition(pos - 1, data);
      } else {
        savePosition(pos - 1, data);
      }
    }

    loadPosition(0);
  }


  create(languages, namespace, key, fallbackValue, callback, options) {
    this.backends.forEach(b => {
      if (b.create) b.create(languages, namespace, key, fallbackValue, null, options);
    });
  }
}

Backend.type = 'backend';

export default Backend;
