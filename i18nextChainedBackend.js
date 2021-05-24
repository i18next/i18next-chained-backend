(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.i18nextChainedBackend = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var arr = [];
  var each = arr.forEach;
  var slice = arr.slice;
  function defaults(obj) {
    each.call(slice.call(arguments, 1), function (source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === undefined) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }
  function createClassOnDemand(ClassOrObject) {
    if (!ClassOrObject) return null;
    if (typeof ClassOrObject === 'function') return new ClassOrObject();
    return ClassOrObject;
  }

  function getDefaults() {
    return {
      handleEmptyResourcesAsFailed: true
    };
  }

  var Backend = /*#__PURE__*/function () {
    function Backend(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Backend);

      this.backends = [];
      this.type = 'backend';
      this.init(services, options);
    }

    _createClass(Backend, [{
      key: "init",
      value: function init(services) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var i18nextOptions = arguments.length > 2 ? arguments[2] : undefined;
        this.services = services;
        this.options = defaults(options, this.options || {}, getDefaults());
        this.options.backends && this.options.backends.forEach(function (b, i) {
          _this.backends[i] = _this.backends[i] || createClassOnDemand(b);

          _this.backends[i].init(services, _this.options.backendOptions && _this.options.backendOptions[i] || {}, i18nextOptions);
        });
      }
    }, {
      key: "read",
      value: function read(language, namespace, callback) {
        var _this2 = this;

        var bLen = this.backends.length;

        var loadPosition = function loadPosition(pos) {
          if (pos >= bLen) return callback(new Error('non of the backend loaded data;', true)); // failed pass retry flag

          var isLastBackend = pos === bLen - 1;
          var lengthCheckAmount = _this2.options.handleEmptyResourcesAsFailed && !isLastBackend ? 0 : -1;
          var backend = _this2.backends[pos];

          if (backend.read) {
            backend.read(language, namespace, function (err, data) {
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
        };

        var savePosition = function savePosition(pos, data) {
          if (pos < 0) return;
          var backend = _this2.backends[pos];

          if (backend.save) {
            backend.save(language, namespace, data);
            savePosition(pos - 1, data);
          } else {
            savePosition(pos - 1, data);
          }
        };

        loadPosition(0);
      }
    }, {
      key: "create",
      value: function create(languages, namespace, key, fallbackValue) {
        this.backends.forEach(function (b) {
          if (b.create) b.create(languages, namespace, key, fallbackValue);
        });
      }
    }]);

    return Backend;
  }();

  Backend.type = 'backend';

  return Backend;

})));
