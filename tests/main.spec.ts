import { expect, test } from '@playwright/test';

test.describe('Risk Roller pages', () => {
  test('has title', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await expect(page).toHaveTitle(/RiskRoller/);
  });

  test('submit the form', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.locator('[data-test="attacking-armies"]').fill('4');
    await page.locator('mat-select').click();
    await page.locator(`mat-option:has-text("${1}")`).click();
    await page.locator('[data-test="attacking-next"]').click();

    await page.locator('[data-test="defending-armies"]').fill('4');
    await page.locator('[data-test="defending-armies-next"]').click();

    await page.locator('[data-test="attack-button"]').click();
    await expect(page.locator('.accordion')).toBeVisible();
  });

})