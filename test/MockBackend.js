class MockBackend {
  constructor(services, options = {}) { /* irrelevant */ }

  init(services, options = {}, i18nextOptions) {
    this.services = services;
    this.options = { ...options, ...this.options };
    this.cache = {};
    this.added = {};

    if (this.options.isCache) {
      this.save = (language, namespace, data) => {
        this.cache[`${language}.${namespace}`] = data;
      }
    }
  }

  read(language, namespace, callback) {
    if (this.options.lngs.indexOf(language) > -1 || this.cache[`${language}.${namespace}`]) {
      setTimeout(() => {
        callback(null, this.options.isCache ? this.cache[`${language}.${namespace}`] : {
          name: this.options.name,
          lng: language,
          ns: namespace
        })
      }, 50);
    } else {
      setTimeout(() => {
        callback(new Error('not available'))
      }, 50);
    }
  }
  // read(language, namespace) {
  //   if (this.options.lngs.indexOf(language) > -1 || this.cache[`${language}.${namespace}`]) {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(this.options.isCache ? this.cache[`${language}.${namespace}`] : {
  //           name: this.options.name,
  //           lng: language,
  //           ns: namespace
  //         })
  //       }, 50);
  //     })
  //   } else {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(new Error('not available'))
  //       }, 50);
  //     })
  //   }
  // }

  create(languages, namespace, key, fallbackValue) {
    this.added[`${languages}.${namespace}.${key}`] = fallbackValue;
  }
}
MockBackend.type = 'backend';

module.exports = MockBackend;
