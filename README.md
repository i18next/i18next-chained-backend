# Introduction

[![npm version](https://img.shields.io/npm/v/i18next-chained-backend.svg?style=flat-square)](https://www.npmjs.com/package/i18next-chained-backend)

This is a i18next backend to chain multiple [other backends](https://www.i18next.com/overview/plugins-and-utils#backends) and caches. So you can define an additional caching backend or fallback backends.

Usage examples for caching configurations can be found [here](https://www.i18next.com/how-to/caching) and for fallback backends can be found [here](https://www.i18next.com/how-to/backend-fallback).

## How it works

For each [backend read call](https://www.i18next.com/misc/creating-own-plugins#backend) (so for each language and namespace combination), it will try to read from from all backends in order until a backend returns some resources.
So if it does not find the resource (language + namespace) in the first backend, it goes to the next, etc.

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
  // array of existing i18next backends from https://www.i18next.com/overview/plugins-and-utils#backends
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

### caching example

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend'; // load from local storage
import HttpApi from 'i18next-http-backend'; // have a own http fallback

i18next
  .use(Backend)
  .init({
    backend: {
      backends: [
        LocalStorageBackend,  // primary
        HttpApi  // fallback
      ],
      backendOptions: [{
        projectId: 'myLocizeProjectId'
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // http api load path for my own fallback
      }],
      // cacheHitMode: 'none' // (default)
      // cacheHitMode: 'refresh' // tries to refresh the cache by loading from the next backend and updates the cache
      // cacheHitMode: 'refreshAndUpdateStore' // tries to refresh the cache by loading from the next backend, updates the cache and also update the i18next resource store
      // reloadInterval: 60 * 60 * 1000 // can be used to reload resources in a specific interval (useful in server environments)
      // refreshExpirationTime: 7 * 24 * 60 * 60 * 1000 // In case of caching with 'refresh' or 'refreshAndUpdateStore', it will only fetch from the next backend if the cached namespace is expired. Only supported if the backend returns the saved timestamp, like i18next-fs-backend, i18next-localstorage-backend
    }
  });
```

### more complete sample

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import Locize from 'i18next-locize-backend'; // load from service
import HttpApi from 'i18next-http-backend'; // have a own http fallback

i18next
  .use(Backend)
  .init({
    backend: {
      backends: [
        Locize,  // primary
        HttpApi  // fallback
      ],
      backendOptions: [{
        projectId: 'myLocizeProjectId'
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // http api load path for my own fallback
      }]
    }
  });
```

*More [locize](https://locize.com) examples can be found here:*
- *[Caching](https://www.locize.com/docs/alternative-caching-with-i18next)*
- *[Backend Fallback](https://www.locize.com/docs/backend-fallback)*
- *[Multiple projects in same i18next instance](https://www.locize.com/docs/is-it-possible-to-integrate-multiple-projects-in-the-same-app-website)*

## TypeScript

To properly type the backend options, you can import the `ChainedBackendOptions` interface and use it as a generic type parameter to the i18next's `init` method, e.g.:

```ts
import i18n from 'i18next'
import ChainedBackend, { ChainedBackendOptions } from 'i18next-chained-backend'

i18n
  .use(ChainedBackend)
  .init<ChainedBackendOptions>({
    backend: {
      backends: [
        Locize,  // primary
        HttpApi  // fallback
      ],
      backendOptions: [{
        projectId: 'myLocizeProjectId'
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // http api load path for my own fallback
      }]
    }

    // other i18next options
  })
```

## IMPORTANT ADVICE for the usage in combination with saveMissing/updateMissing

We suggest not to use mutliple backends in combination with saveMissing or updateMissing, because it may happen, that the trigger for this is based on stale data.


--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>

---

**localization as a service - locize.com**

Needing a translation management? Want to edit your translations with an InContext Editor? Use the orginal provided to you by the maintainers of i18next!

![locize](https://cdn.prod.website-files.com/67a323e323a50df7f24f0a6f/67b8bbb29365c3a3c21c0898_github_locize.png)

With using [locize](http://locize.com/?utm_source=react_i18next_readme&utm_medium=github) you directly support the future of i18next and react-i18next.

---
