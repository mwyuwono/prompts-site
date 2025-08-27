
import { test, expect } from '@playwright/test';

test('CSS files are loaded correctly on Audio Essay page', async ({ page }) => {
  const cssRequests = [];
  page.on('response', response => {
    if (response.request().resourceType() === 'stylesheet') {
      cssRequests.push(response);
    }
  });

  await page.goto('file:///Users/mwy/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/audio-essay.html');

  // Ensure that main.css is loaded successfully
  const mainCssRequest = cssRequests.find(response => response.url().includes('main.css'));
  expect(mainCssRequest).toBeTruthy();
  expect(mainCssRequest.status()).toBe(200);

  // Ensure that no CSS file returns a 404 error
  for (const response of cssRequests) {
    expect(response.status()).not.toBe(404);
  }
});
