import i18next from 'i18next';
import Backend from 'i18next-chained-backend';

i18next.use(Backend).init({
  backend: {
    backends: [],
    backendOptions: []
  },
});
