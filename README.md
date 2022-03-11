# Introduction

[![Travis](https://img.shields.io/travis/i18next/i18next-chained-backend/master.svg?style=flat-square)](https://travis-ci.org/i18next/i18next-chained-backend)
[![Coveralls](https://img.shields.io/coveralls/i18next/i18next-chained-backend/master.svg?style=flat-square)](https://coveralls.io/github/i18next/i18next-chained-backend)
[![npm version](https://img.shields.io/npm/v/i18next-chained-backend.svg?style=flat-square)](https://www.npmjs.com/package/i18next-chained-backend)
[![David](https://img.shields.io/david/i18next/i18next-chained-backend.svg?style=flat-square)](https://david-dm.org/i18next/i18next-chained-backend)

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
- *[Caching](https://docs.locize.com/more/caching/alternative-caching)*
- *[Backend Fallback](https://docs.locize.com/more/backend-fallback)*
- *[Multiple projects in same i18next instance](https://docs.locize.com/more/general-questions/is-it-possible-to-integrate-multiple-projects-in-the-same-app-website)*

## TypeScript
To prevent TypeScript errors/conflicts with other plugins, we recommend placing `i18next-chained-backend` import above other plugins. Also, make sure to set `skipLibCheck` to `true` under your tsconfig file.

```ts
import i18next from 'i18next';
import Backend from 'i18next-chained-backend'; // i18next-chained-backend should be placed here
import Locize from 'i18next-locize-backend';
import HttpApi from 'i18next-http-backend';
```

## IMPORTANT ADVICE for the usage in combination with saveMissing/updateMissing

We suggest not to use mutliple backends in combination with saveMissing or updateMissing, because it may happen, that the trigger for this is based on stale data.


--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>

---

**localization as a service - locize.com**

Needing a translation management? Want to edit your translations with an InContext Editor? Use the orginal provided to you by the maintainers of i18next!

![locize](https://locize.com/img/ads/github_locize.png)

With using [locize](http://locize.com/?utm_source=react_i18next_readme&utm_medium=github) you directly support the future of i18next and react-i18next.

---
