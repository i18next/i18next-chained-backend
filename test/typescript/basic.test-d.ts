import i18next from 'i18next';
import Backend, { ChainedBackendOptions } from 'i18next-chained-backend';
import LocizeBackend from 'i18next-locize-backend';
import HTTPBackendLocal from 'i18next-http-backend';

i18next.use(Backend).init<ChainedBackendOptions>({
  backend: {
    backends: [
      LocizeBackend,  // primary
      HTTPBackendLocal  // fallback
    ],
    backendOptions: [{
      projectId: 'myLocizeProjectId'
    }, {
      loadPath: '/locales/{{lng}}/{{ns}}.json' // http api load path for my own fallback
    }]
  },
});
