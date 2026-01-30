const fs = require('fs');
const path = require('path');

try {
    const cwd = process.cwd();

    // Read source files
    const htmlPath = path.join(cwd, 'index.html');
    const cssPath = path.join(cwd, 'style.css');
    const jsPath = path.join(cwd, 'app.js');

    if (!fs.existsSync(htmlPath)) throw new Error('index.html not found');
    if (!fs.existsSync(cssPath)) throw new Error('style.css not found');
    if (!fs.existsSync(jsPath)) throw new Error('app.js not found');

    let html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');
    let js = fs.readFileSync(jsPath, 'utf8');

    // Remove imports from JS (basic support)
    js = js.replace(/^import .* from .*/gm, '// import removed for bundle');
    // Remove exports
    js = js.replace(/^export /gm, '');

    // Inject CSS
    const styleTag = `<style>\n${css}\n</style>`;
    html = html.replace('<link rel="stylesheet" href="style.css">', styleTag);

    // Inject JS - support both module and regular script tags
    const scriptTag = `<script>\n${js}\n</script>`;
    html = html.replace('<script type="module" src="app.js"></script>', scriptTag);
    html = html.replace('<script src="app.js"></script>', scriptTag);

    // Write output
    const previewDir = path.join(cwd, 'preview');
    if (!fs.existsSync(previewDir)) {
        fs.mkdirSync(previewDir);
    }

    // Versioning Logic
    let version = 1;
    const files = fs.readdirSync(previewDir);
    const existingVersions = files
        .filter(f => f.match(/^preview_v(\d+)\.html$/))
        .map(f => parseInt(f.match(/^preview_v(\d+)\.html$/)[1]));

    if (existingVersions.length > 0) {
        version = Math.max(...existingVersions) + 1;
    }

    const outPath = path.join(previewDir, `preview_v${version}.html`);
    fs.writeFileSync(outPath, html);

    console.log(`✅ Bundle complete: ${outPath}`);

    // Auto-open in browser (unless --no-open flag is passed)
    if (!process.argv.includes('--no-open')) {
        try {
            const { exec } = require('child_process');
            exec(`open "${outPath}"`);
            console.log('🚀 Opened in browser.');
        } catch (e) {
            console.warn('⚠️ Could not open browser automatically.');
        }
    } else {
        console.log('ℹ️ Browser auto-open skipped (--no-open).');
    }

} catch (error) {
    console.error('❌ Error during bundling:', error);
    process.exit(1);
}
