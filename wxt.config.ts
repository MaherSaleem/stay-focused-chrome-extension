import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Stay Focused',
    description:
      'Block distracting websites and get funny images to go back to work.',
    permissions: ['storage', 'webNavigation', 'tabs'],
    host_permissions: ['http://*/*', 'https://*/*'],
    icons: {
      '16': 'icons/icon_16.png',
      '32': 'icons/icon_32.png',
      '48': 'icons/icon_48_HQ.png',
      '128': 'icons/icon_128.png',
    },
  },
});
