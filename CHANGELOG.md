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
