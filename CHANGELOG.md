### 5.0.8

- fix: with i18next 26.7.1 or later, `reloadInterval` reloads everything i18next loaded or tried to load through the backend: the current languages and the languages loaded for clones (one per request on a server), and it retries the bundles that failed. 5.0.7 passed the fallback and `preload` languages to i18next's `reloadResources()`, which skipped a bundle that had failed to load, so a language missing after an outage at startup stayed missing (the backend's own reload before 5.0.7 read it again). With older i18next nothing changes.

### 5.0.7

- fix: with i18next 26.7.0 or later, `create` gets its options (`isUpdate`). i18next 26.7.0 deprecates guessing the calling convention of a backend from the number of parameters of its methods; the backend now declares it with `callbackApi`, so i18next calls `read` and `create` with a callback (and passes `create` its options), and debug mode no longer logs the deprecation notice. Older i18next versions ignore it. Its `create(languages, namespace, key, fallbackValue, clb = () => {}, opts = {})` has a `Function.length` of 4 because of the default parameters, so i18next called it without the options.
- feat: the chained backends are called the way their own `callbackApi` declares (`true`: callbacks, `false`: a promise or a value), like i18next 26.7 does; without it, the number of parameters decides, as before.
- `reloadInterval` reloads through `services.utils.reloadResources` with i18next 26.7.0 or later (with i18next's retries and the `loaded` event) instead of calling i18next's internal backend connector. It reloads the same languages as before: the fallback and `preload` languages. With older i18next nothing changes.

### 5.0.6

- chore: removed the unused `extend()` helper from `utils`. It merged with `for...in` and no own-property check, so a source object carrying an own `__proto__` key (as `JSON.parse` produces) reassigned the target's prototype. Nothing in the package called it and rollup already tree-shook it out of every published bundle, so this is a source cleanup with no effect on consumers.
- chore: `defaults()` now iterates own enumerable keys only and skips `__proto__` / `constructor` / `prototype`. Its existing `=== undefined` check already blocked the pollution paths, so this is defense in depth and aligns the helper with the equivalents in `i18next-http-backend`, `i18next-fs-backend` and `i18next-http-middleware`.

### 5.0.5

- fix: do not signal retry to i18next by default when all chained backends fail, introduce opt-in retryOnFailure option #53

### 5.0.4

- fix: signal retry to i18next when all chained backends fail
#51

### 5.0.3

- warn when using saveMissing/updateMissing with multiple backends

### 5.0.2

- try to fix commonjs build to address #45

### 5.0.1

- try to adapt package export to address #44

### 5.0.0

- fix TS issue (needed to switch to ESM by default) #43

### 4.6.3

- Fix read-callback typing #39

### 4.6.2

- fix package exports

### 4.6.1

- fix package exports

### 4.6.0

- fix: separate cjs and mjs typings

### 4.5.0

- introduce refreshExpirationTime

### 4.4.0

- introduce reloadInterval

### 4.3.0

- introduce cacheHitMode

### 4.2.0

- Export the backend options type

### 4.1.0

- extend to accept also backends with promise / async-await signature

### 4.0.1

- typescript: static type prop

### 4.0.0

- typescript fix for i18next v22

### 3.1.0

- pass down options to create function

### 3.0.2

- build to trigger Deno

### 3.0.1

- backendOptions can be optional

### 3.0.0

- by default handle empty resources like failed backend reads

### 2.1.0

- Type PluginOptions properly [18](https://github.com/i18next/i18next-chained-backend/pull/18)

### 2.0.1

- fixes attempt to save data on invalid response

### 2.0.0

- removes deprecated jsnext:main from package.json
- Bundle all entry points with rollup [8](https://github.com/i18next/i18next-chained-backend/pull/8)
- **note:** dist/es -> dist/esm, dist/commonjs -> dist/cjs (individual files -> one bundled file)

### 1.0.1

- typescript: fix types [6](https://github.com/i18next/i18next-chained-backend/pull/6)

### 1.0.0

- typescript: add types [5](https://github.com/i18next/i18next-chained-backend/pull/5)

### 0.1.2

- fixes upper bound for backend accessing in load

### 0.1.1

- fixes init call with no options (i18next construct class)

### 0.1.0

- initial version
