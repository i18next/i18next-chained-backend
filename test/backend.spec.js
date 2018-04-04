import Backend from '../src/';
import Interpolator from 'i18next/dist/commonjs/Interpolator';
import MockBackend from './MockBackend';


describe('chained backend', () => {

  describe('basic read', () => {
    let backend;

    before(() => {
      backend = new Backend({
        interpolator: new Interpolator()
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
        interpolator: new Interpolator()
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


  // describe('with loadPath function', () => {
  //   let backend;
  //   let loadPathSpy = sinon.spy(function(languages, namespaces) {
  //     return 'http://localhost:9876/locales/' + languages[0] + '/' + namespaces[0] + '.json';
  //   });
  //
  //   before(() => {
  //     backend = new XHR({
  //       interpolator: new Interpolator()
  //     }, {
  //       loadPath: loadPathSpy
  //     });
  //   });
  //
  //   describe('#read', () => {
  //
  //     it('should load data', (done) => {
  //       backend.read('en', 'test', function(err, data) {
  //         expect(err).to.be.not.ok;
  //         expect(loadPathSpy.calledWith(['en'], ['test'])).to.be.ok;
  //         expect(data).to.eql({key: 'passing'});
  //         done();
  //       });
  //     });
  //
  //   });
  //
  // });

});
