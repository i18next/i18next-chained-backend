declare namespace I18NextChainedBackend {
  interface BackendOptions {
    /**
     * array of existing i18next backends from https://www.i18next.com/plugins-and-utils.html#backends
     */
    backends?: any[];
    /**
     * array of options in order of backends above
     */
    backendOptions?: any[];
  }

  type LoadCallback = (error: any, result: string | false) => void;
}

declare class I18NextChainedBackend {
  constructor(services: any, options?: I18NextChainedBackend.BackendOptions);
  init(services: any, options?: I18NextChainedBackend.BackendOptions): void;
  read(language: string, namespace: string, callback: I18NextChainedBackend.LoadCallback): void;
  create(languages: string | string[], namespace: string, key: string, fallbackValue: string): void;
  type: "backend";
  services: any;
  backends: any[];
  options: I18NextChainedBackend.BackendOptions;
}

export = I18NextChainedBackend;