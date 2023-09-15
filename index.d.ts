import { BackendModule, ReadCallback } from "i18next";

export interface ChainedBackendOptions {
  /**
   * array of existing i18next backends from https://www.i18next.com/plugins-and-utils.html#backends
   */
  backends?: any[];
  /**
   * array of options in order of backends above
   */
  backendOptions?: any[];
  /**
   * In case of caching it tries to:
   * refresh: refresh the cache by loading from the next backend and updates the cache
   * refreshAndUpdateStore: refresh the cache by loading from the next backend, updates the cache and also update the i18next resource store
   * @default 'none'
   */
  cacheHitMode?: 'none' | 'refresh' | 'refreshAndUpdateStore';

  /**
   * can be used to reload resources in a specific
   * interval (useful in server environments)
   * @default false
   */
  reloadInterval?: false | number;

  /**
   * In case of caching with 'refresh' or 'refreshAndUpdateStore', it will only fetch from the next backend if the cached namespace is expired.
   * Only supported if the backend returns the saved timestamp, like i18next-fs-backend, i18next-localstorage-backend
   * @default undefined
   */
  refreshExpirationTime?: number;
}

export default class I18NextChainedBackend
  implements BackendModule<ChainedBackendOptions> {
  static type: "backend";
  constructor(services?: any, options?: ChainedBackendOptions);
  init(
    services?: any,
    options?: ChainedBackendOptions,
    i18nextOptions?: any
  ): void;
  read(
    language: string,
    namespace: string,
    callback: ReadCallback
  ): void;
  create(
    languages: string[],
    namespace: string,
    key: string,
    fallbackValue: string
  ): void;
  type: "backend";
  services: any;
  backends: any[];
  options: ChainedBackendOptions;
}
