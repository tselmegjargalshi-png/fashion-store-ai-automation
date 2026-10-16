# Upwork portfolio thumbnail

`elora-upwork-thumbnail.png` — 2000 × 1500 px (4:3), PNG. Upwork's minimum for a portfolio image is 1000 × 750; this is 2× that.

## Re-rendering

`thumbnail/thumbnail.html` is the editable source (fonts and screenshots are local, so it renders offline). Open it in Chromium at a 2000 × 1500 viewport, or with Playwright:

```js
const page = await browser.newPage({ viewport: { width: 2000, height: 1500 } });
await page.goto("file:///path/to/docs/portfolio/thumbnail/thumbnail.html");
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "elora-upwork-thumbnail.png" });
```

## Using your own screenshots

The three images in `thumbnail/shots/` (`checkout.png`, `drawer.png`, `chat.png`) are real captures of the site's UI. They were taken in an environment where the Unsplash photos could not load, so product images appear as plain tonal tiles. For a richer thumbnail, replace them with captures of the live site (desktop checkout at 1440 × 900, phone views at 390 × 844, both at 2× scale) and re-render.

Fonts: Cormorant Garamond and Jost (SIL Open Font License), via the `@fontsource` packages.
