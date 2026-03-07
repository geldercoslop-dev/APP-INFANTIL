const fs = require('fs');
const path = require('path');

// Simple PNG generator using canvas-like approach
function generatePNGIcon(size, isMaskable = false) {
  const width = size;
  const height = size;
  
  // Create a simple gradient background with emoji
  const canvasData = [];
  
  // PNG header (simplified)
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // Create a simple 32x32 pixel image for testing (will be scaled)
  const pixels = [];
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      // Simple gradient from purple to blue
      const r = Math.floor(102 + (x * 154 / 32));
      const g = Math.floor(126 + (y * 130 / 32));
      const b = Math.floor(234 - (x * 76 / 32));
      const a = 255;
      
      pixels.push(r, g, b, a);
    }
  }
  
  // For now, create a minimal valid PNG using a different approach
  // We'll use a data URL approach since creating PNG from scratch is complex
  
  const svgTemplate = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  ${isMaskable ? 
    `<rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.15}"/>` :
    `<rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.234}"/>`
  }
  <text x="${size/2}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.35}" font-weight="bold" text-anchor="middle" fill="white">🚀</text>
</svg>`;
  
  return svgTemplate;
}

// Convert SVG to PNG data URL (simplified approach)
function svgToDataURL(svg) {
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Generate icons
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [192, 512];
const maskableSizes = [192, 512];

console.log('Generating PWA icons...');

// Generate regular icons
sizes.forEach(size => {
  const svg = generatePNGIcon(size, false);
  const dataURL = svgToDataURL(svg);
  
  // For now, save as SVG (will be converted to PNG later)
  const svgPath = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: icon-${size}.svg`);
});

// Generate maskable icons
maskableSizes.forEach(size => {
  const svg = generatePNGIcon(size, true);
  const dataURL = svgToDataURL(svg);
  
  // For now, save as SVG (will be converted to PNG later)
  const svgPath = path.join(iconsDir, `icon-${size}-maskable.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: icon-${size}-maskable.svg`);
});

console.log('Icons generated as SVG. Use online converter to create PNG files.');
console.log('Recommended: https://convertio.co/svg-png/ or similar tool');
