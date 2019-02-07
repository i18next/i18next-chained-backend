# Introduction

[![Travis](https://img.shields.io/travis/i18next/i18next-chained-backend/master.svg?style=flat-square)](https://travis-ci.org/i18next/i18next-chained-backend)
[![Coveralls](https://img.shields.io/coveralls/i18next/i18next-chained-backend/master.svg?style=flat-square)](https://coveralls.io/github/i18next/i18next-chained-backend)
[![npm version](https://img.shields.io/npm/v/i18next-chained-backend.svg?style=flat-square)](https://www.npmjs.com/package/i18next-chained-backend)
[![David](https://img.shields.io/david/i18next/i18next-chained-backend.svg?style=flat-square)](https://david-dm.org/i18next/i18next-chained-backend)

This is a i18next backend to chain multiple [other backends](https://www.i18next.com/plugins-and-utils.html#backends) and caches. So you can define an additional caching backend or fallback backends.

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/i18next-chained-backend) or [downloaded](https://github.com/i18next/i18next-chained-backend/blob/master/i18nextBackendBackend.min.js) from this repo.

```
# npm package
$ npm install i18next-chained-backend
```

Wiring up:

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';

i18next
  .use(Backend)
  .init(i18nextOptions);
```

- As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.
- If you don't use a module loader it will be added to `window.i18nextChainedBackend`

## Backend Options

```js
{
  // array of existing i18next backends from https://www.i18next.com/plugins-and-utils.html#backends
  backends: [],

  // array of options in order of backends above
  backendOptions: []
}
```

Options can be passed in:

**preferred** - by setting options.backend in i18next.init:

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';

i18next
  .use(Backend)
  .init({
    backend: options
  });
```

on construction:

```js
  import Backend from 'i18next-chained-backend';
  const Backend = new Backend(null, options);
```

via calling init:

```js
  import Backend from 'i18next-chained-backend';
  const Backend = new Backend();
  Backend.init(null, options);
```

### more complete sample

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import Locize from 'i18next-locize-backend'; // load from service
import XHR from 'i18next-xhr-backend'; // have a own xhr fallback

i18next
  .use(Backend)
  .init({
    backend: {
      backends: [
        Locize,  // primary
        XHR      // fallback
      ],
      backendOptions: [{
        projectId: 'myLocizeProjectId'
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // xhr load path for my own fallback
      }]
    }
  });
```

--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>
