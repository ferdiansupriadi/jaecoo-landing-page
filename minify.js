const { minify } = require('terser');
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

const jsFiles = [
  'config.js',
  'scripts-index.js',
  'scripts-about.js',
  'scripts-faq.js',
  'scripts-service.js',
  'scripts-j5ev.js',
  'scripts-j7.js',
  'scripts-j8.js',
  'scripts-shs-ardis.js',
  'scripts-story-ardis-tech.js',
  'scripts-story-ev-jakarta.js',
  'scripts-story-hybrid-tips.js',
  'scripts-story-j5-vs-byd-atto3.js',
  'scripts-story-j5ev-launch.js',
  'scripts-story-j5ev-no1.js',
  'scripts-story-j7-comparison.js',
  'scripts-story-j8-muri-record.js',
  'scripts-story-promo-2026.js',
  'scripts-story-test-drive.js',
];

const cssFiles = [
  'styles-index.css',
  'styles-index-extra.css',
  'styles-about.css',
  'styles-faq.css',
  'styles-service.css',
  'styles-j5ev.css',
  'styles-shs-ardis.css',
  'styles-story-ardis-tech.css',
  'styles-story-ev-jakarta.css',
  'styles-story-hybrid-tips.css',
  'styles-story-j5-vs-byd-atto3.css',
  'styles-story-j5ev-launch.css',
  'styles-story-j5ev-no1.css',
  'styles-story-j7-comparison.css',
  'styles-story-j8-muri-record.css',
  'styles-story-promo-2026.css',
  'styles-story-test-drive.css',
  'tailwind-purged.css',
];

async function minifyJS() {
  for (const file of jsFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) { console.log(`Skipping (not found): ${file}`); continue; }
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await minify(code, { compress: true, mangle: true });
    const before = code.length;
    const after = result.code.length;
    fs.writeFileSync(filePath, result.code, 'utf8');
    console.log(`JS  ${file}: ${before} → ${after} bytes (${Math.round((1 - after/before)*100)}% smaller)`);
  }
}

function minifyCSS() {
  const cleancss = new CleanCSS({ level: 2 });
  for (const file of cssFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) { console.log(`Skipping (not found): ${file}`); continue; }
    const code = fs.readFileSync(filePath, 'utf8');
    const result = cleancss.minify(code);
    if (result.errors.length) { console.error(`CSS error in ${file}:`, result.errors); continue; }
    const before = code.length;
    const after = result.styles.length;
    fs.writeFileSync(filePath, result.styles, 'utf8');
    console.log(`CSS ${file}: ${before} → ${after} bytes (${Math.round((1 - after/before)*100)}% smaller)`);
  }
}

(async () => {
  console.log('Minifying JS files...');
  await minifyJS();
  console.log('\nMinifying CSS files...');
  minifyCSS();
  console.log('\nDone!');
})();
