import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pecs.meuapp',
  appName: 'ConectaPecs',
  webDir: 'dist',
  server:{
    androidScheme: 'http',
    hostname: 'localhost',
    allowNavigation: ['192.168.0.3:3000']
  }
};

export default config;
