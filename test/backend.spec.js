const expect = require('expect.js')
const Backend = require('../');
const i18next = require('i18next');
const MockBackend = require('./MockBackend');
const resourcesToBackend = require('i18next-resources-to-backend');

describe('chained backend', () => {

  describe('basic read', () => {
    let backend;

    before(() => {
      backend = new Backend({
        interpolator: i18next.services.interpolator
      }, {
        backends: [
          MockBackend,
          MockBackend
        ],
        backendOptions: [{
          name: 'backend1',
          lngs: ['de']
        }, {
          name: 'backend2',
          lngs: ['en']
        }]
      });
    });

    it('should load data', (done) => {
      backend.read('en', 'test', function(err, data) {
        expect(data).to.eql({ name: 'backend2', lng: 'en', ns: 'test' });

        backend.read('de', 'test2', function(err, data) {
          expect(data).to.eql({ name: 'backend1', lng: 'de', ns: 'test2' });
          done();
        });
      });
    });

    it('should save missing', () => {
      backend.create('en', 'test', 'key1', 'test1');
      expect(backend.backends[0].added['en.test.key1']).to.eql('test1');
      expect(backend.backends[1].added['en.test.key1']).to.eql('test1');
    });

  });

  describe('basic save (cache)', () => {
    let backend;

    before(() => {
      backend = new Backend({
        interpolator: i18next.services.interpolator
      }, {
        backends: [
          MockBackend,
          MockBackend,
          MockBackend
        ],
        backendOptions: [{
          name: 'cache1',
          lngs: ['de', 'en'],
          isCache: true
        }, {
          name: 'backend1',
          lngs: ['de']
        }, {
          name: 'backend2',
          lngs: ['en']
        }]
      });
    });

    it('should load / cache data', (done) => {
      backend.read('en', 'test', function(err, data, pos) {
        expect(data).to.eql({ name: 'backend2', lng: 'en', ns: 'test' });
        expect(pos).to.eql(2)

        backend.read('de', 'test2', function(err, data, pos) {
          expect(data).to.eql({ name: 'backend1', lng: 'de', ns: 'test2' });
          expect(pos).to.eql(1)

          // hit cache
          backend.read('en', 'test', function(err, data, pos) {
            expect(data).to.eql({ name: 'backend2', lng: 'en', ns: 'test' });
            expect(pos).to.eql(0)

            backend.read('de', 'test2', function(err, data, pos) {
              expect(data).to.eql({ name: 'backend1', lng: 'de', ns: 'test2' });
              expect(pos).to.eql(0)
              done();
            });
          });

        });
      });
    });

  });

  describe('refresh cache', () => {
    let backend;
    const myResources = {
      en: {
        test: {
          keyOne: 'key one',
          keyTwo: 'key two'
        }
      }
    }

    before(() => {
      backend = new Backend({
        interpolator: i18next.services.interpolator
      }, {
        cacheHitMode: 'refresh',
        backends: [
          MockBackend,
          resourcesToBackend((language, namespace) => ({ ...myResources[language][namespace] }))
        ],
        backendOptions: [{
          name: 'cache1',
          lngs: ['de', 'en'],
          isCache: true
        }]
      });
    });

    it('should load / cache data', (done) => {
      backend.read('en', 'test', function(err, data, pos) {
        expect(pos).to.eql(1);
        expect(data.keyOne).to.eql('key one');

        // simulate changed translations
        myResources.en.test.keyOne += ' changed'

        // hit cache and trigger cache refresh
        backend.read('en', 'test', function(err, data, pos) {
          expect(pos).to.eql(0);
          expect(data.keyOne).to.eql('key one');

          // should now get the updated value
          backend.read('en', 'test', function(err, data, pos) {
            expect(pos).to.eql(0);
            expect(data.keyOne).to.eql('key one changed');
  
            done();
          });
        });
      });
    });

  });

  describe('refresh cache and update i18next store', () => {
    let i18nInst;
    const myResources = {
      en: {
        myNS: {
          keyOne: 'key one',
          keyTwo: 'key two'
        }
      }
    }

    before((done) => {
      i18nInst = i18next.createInstance();
      i18nInst.use(Backend).init({
        // debug: true,
        fallbackLng: 'en',
        ns: [],
        backend: {
          cacheHitMode: 'refreshAndUpdateStore',
          backends: [
            MockBackend,
            resourcesToBackend((language, namespace) => ({ ...myResources[language][namespace] }))
          ],
          backendOptions: [{
            name: 'cache1',
            lngs: ['de', 'en'],
            isCache: true
          }]
        }
      }, done);
    });

    it('should load / cache data', (done) => {
      i18nInst.loadNamespaces('myNS', () => {
        expect(i18nInst.t('keyOne', { ns: 'myNS' })).to.eql('key one');

        // simulate changed translations
        myResources.en.myNS.keyOne += ' changed';
        
        i18nInst.reloadResources(['en'], ['myNS'], () => {
          // give a chance to update
          setImmediate(() => {
            expect(i18nInst.t('keyOne', { ns: 'myNS' })).to.eql('key one changed');
            done();
          });
        });
      });
    });

  });

});
