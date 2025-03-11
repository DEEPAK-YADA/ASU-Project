import { defineConfig } from '@playwright/test';

console.log('Loading Playwright configuration...');

export default defineConfig({

  timeout: 60000,
  // retries: 1,
  reporter: [['html', { outputFolder: 'playwrighttest-report' }]], // Generate HTML report
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on', // Enable video recording
    screenshot: 'only-on-failure',
  },
  globalTeardown: require.resolve('./e2e/global-teardown.ts'), // Ensure this points to the correct file
});

console.log('Playwright configuration loaded.');
