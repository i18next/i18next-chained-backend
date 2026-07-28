let arr = [];
let each = arr.forEach;
let slice = arr.slice;

const UNSAFE_KEYS = ['__proto__', 'constructor', 'prototype'];

// Own enumerable keys only, skipping prototype keys. `for...in` walks the
// prototype chain, so an already-polluted Object.prototype would be copied
// into the options object, and a source parsed from JSON carries `__proto__`
// as an own key whose assignment would reassign the target's prototype.
export function defaults(obj) {
  each.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (const prop of Object.keys(source)) {
        if (UNSAFE_KEYS.indexOf(prop) > -1) continue;
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

export function createClassOnDemand(ClassOrObject) {
  if (!ClassOrObject) return null;
  if (typeof ClassOrObject === 'function') return new ClassOrObject();
  return ClassOrObject;
}
