const fs = require('fs');
const path = require('path');

// Timestamp for backups
const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);

// File Config
const FILES = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prototype</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <!-- Main Application Content -->
    </div>
    <script type="module" src="app.js"></script>
</body>
</html>`,
    'style.css': `:root {
    --primary: #3b82f6;
    --secondary: #10b981;
    --bg: #f9fafb;
    --text: #111827;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    font-family: 'Inter', system-ui, sans-serif;
    background-color: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
#app { width: 100%; max-width: 900px; padding: 2rem; }`,
    'app.js': `console.log('App initialized.');
const app = document.getElementById('app');

const state = {};

function render() {
    // UI update logic
}

render();`
};

// Main Execution
// Main Execution
try {
    const cwd = process.cwd();
    console.log(`Working directory: ${cwd}`);

    // Ensure temp directory exists
    const tempDir = path.join(cwd, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
        console.log(`[Init] Created temp directory: ${tempDir}`);
    }

    // 1. Archive existing preview folder to temp/preview_TIMESTAMP
    const previewDir = path.join(cwd, 'preview');
    if (fs.existsSync(previewDir)) {
        const archiveName = `preview_${timestamp}`;
        const destPath = path.join(tempDir, archiveName);
        fs.renameSync(previewDir, destPath);
        console.log(`[Archive] Moved preview -> temp/${archiveName}`);
    }

    // 2. File Creation Loop
    for (const [filename, content] of Object.entries(FILES)) {
        const filePath = path.join(cwd, filename);

        // Safety: Backup if exists to temp/filename_TIMESTAMP
        if (fs.existsSync(filePath)) {
            // e.g. index.html_20260122...
            const backupName = `${filename}_${timestamp}`;
            const destPath = path.join(tempDir, backupName);
            fs.renameSync(filePath, destPath);
            console.log(`[Backup] Moved ${filename} -> temp/${backupName}`);
        }

        // Create new file
        fs.writeFileSync(filePath, content);
        console.log(`[Create] Created ${filename}`);
    }

    console.log('✅ Scaffold complete.');
} catch (error) {
    console.error('❌ Error during scaffolding:', error);
    process.exit(1);
}
