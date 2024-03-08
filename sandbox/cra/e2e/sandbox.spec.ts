import { test, expect } from "@playwright/test";

test("test-1", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByLabel("Firstname").click();
  await page.getByLabel("Firstname").fill("John");
  await page.getByLabel("Firstname").press("Tab");
  await page.getByLabel("Surname").fill("Doe");
  await page.getByRole("button", { name: "next >" }).click();
  await page.getByLabel("Age").click();
  await page.getByLabel("Age").press("Meta+a");
  await page.getByLabel("Age").fill("30");
  await page.getByRole("button", { name: "option 1" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator("pre")).toContainText(
    '{ "firstname": "John", "surname": "Doe", "age": "30", "options": { "key": 1, "value": "Value for option 1" } }'
  );
});
