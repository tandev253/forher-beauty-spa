import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const adminDir = path.join(distDir, 'admin');

if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}

// 1. Copy index.html to admin/index.html so https://forherbeauty.vn/admin loads directly with HTTP 200
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(adminDir, 'index.html'));
  console.log('✓ Created dist/admin/index.html for direct /admin URL routing');

  // 2. Copy index.html to 404.html for SPA GitHub Pages fallback
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
  console.log('✓ Created dist/404.html for GitHub Pages SPA fallback');
}
