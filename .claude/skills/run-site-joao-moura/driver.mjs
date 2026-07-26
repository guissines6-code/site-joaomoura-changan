// Driver one-shot: lança o Chrome instalado no sistema via playwright-core,
// navega pelo index.html, tira screenshots de cada seção em mobile e
// desktop, testa o menu hamburguer / accordion do FAQ, e reporta qualquer
// erro de console ou de página encontrado.
//
// Uso: node driver.mjs [url] [shotDir]
//   url     default: http://localhost:8080/index.html
//   shotDir default: ./.tmp-shots (relativo a este arquivo)

import { chromium } from "playwright-core";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.argv[2] || "http://localhost:8080/index.html";
const SHOT_DIR = process.argv[3] || path.join(__dirname, ".tmp-shots");
fs.mkdirSync(SHOT_DIR, { recursive: true });

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];
const CHROME_PATH = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!CHROME_PATH) {
  console.error("Chrome não encontrado em nenhum dos caminhos esperados:", CHROME_CANDIDATES);
  process.exit(1);
}

const SECTIONS = [
  "destaque-unit",
  "modelos",
  "diferenciais",
  "depoimentos",
  "faq",
  "contato",
];

const errors = [];

async function run(viewportName, width, height) {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${viewportName}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${viewportName}] PAGE ERROR: ${err.message}`));

  await page.goto(URL, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SHOT_DIR}/${viewportName}-00-hero.png` });

  for (const id of SECTIONS) {
    await page.evaluate((sectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    }, id);
    // seção "modelos" tem auto-scroll de 3s no carrossel — espera dar tempo de disparar uma vez
    await page.waitForTimeout(id === "modelos" ? 4000 : 700);
    await page.screenshot({ path: `${SHOT_DIR}/${viewportName}-${id}.png` });
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOT_DIR}/${viewportName}-footer.png` });

  // Interações
  if (width < 860) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const hamburger = await page.$("#hamburger");
    if (hamburger) {
      await hamburger.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SHOT_DIR}/${viewportName}-menu-aberto.png` });
      await hamburger.click(); // fecha de novo pra não vazar pro próximo screenshot
      await page.waitForTimeout(300);
    }
  }

  const faqBtn = await page.$(".faq-question");
  if (faqBtn) {
    await faqBtn.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await faqBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SHOT_DIR}/${viewportName}-faq-aberto.png` });
  }

  await browser.close();
  console.log(`[${viewportName}] concluído.`);
}

await run("mobile", 390, 844);
await run("desktop", 1440, 900);

console.log(`\nScreenshots salvos em: ${SHOT_DIR}`);
console.log("\n--- erros de console/página ---");
if (errors.length === 0) console.log("nenhum erro encontrado.");
else errors.forEach((e) => console.log(e));
