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
