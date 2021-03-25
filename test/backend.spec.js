const expect = require('expect.js')
const Backend = require('../');
const i18next = require('i18next');
const MockBackend = require('./MockBackend');

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

});
