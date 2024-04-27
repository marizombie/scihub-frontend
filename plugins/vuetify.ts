// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'customLight',
      themes: {
        customDark: {
          dark: true,
          colors: {
            primary: '#1976D2',
            accent: '#424242',
            secondary: '#FF8F00',
            info: '#26A69A',
            warning: '#FFC107',
            error: '#DD2C00',
            success: '#00E676'
          }
        },
        customLight: {
          dark: false,
          colors: {
            primary: '#9C27B0',
            secondary: '#757575',
            accent: '#000000',
            error: '#FF1744'
          }
        }
      }
    },
    defaults: {}
  });
  app.vueApp.use(vuetify);
});
