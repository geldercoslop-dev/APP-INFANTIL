// Create minimal valid PNG files using a simple approach
const fs = require('fs');
const path = require('path');

function createMinimalPNG(width, height) {
  // Create a simple 1x1 pixel PNG that can be scaled
  // This is a minimal valid PNG with a single transparent pixel
  
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([ihdrData.length, ihdrData.length >> 8, ihdrData.length >> 16, ihdrData.length >> 24]),
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.from([ihdrCrc, ihdrCrc >> 8, ihdrCrc >> 16, ihdrCrc >> 24])
  ]);
  
  // IDAT chunk with one transparent pixel
  const pixelData = Buffer.from([0, 0, 0, 0]); // transparent pixel
  const compressed = Buffer.from([0x78, 0x01, 0x01, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00]); // minimal zlib
  
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatChunk = Buffer.concat([
    Buffer.from([compressed.length, compressed.length >> 8, compressed.length >> 16, compressed.length >> 24]),
    Buffer.from('IDAT'),
    compressed,
    Buffer.from([idatCrc, idatCrc >> 8, idatCrc >> 16, idatCrc >> 24])
  ]);
  
  // IEND chunk
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),
    Buffer.from('IEND'),
    Buffer.from([iendCrc, iendCrc >> 8, iendCrc >> 16, iendCrc >> 24])
  ]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Simple CRC32 implementation
function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Create icons
const iconsDir = path.join(__dirname, '../public/icons');

const sizes = [192, 512];
const maskableSizes = [192, 512];

console.log('Creating minimal PNG icons...');

// Create regular icons
sizes.forEach(size => {
  const png = createMinimalPNG(size, size);
  const pngPath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(pngPath, png);
  console.log(`Created: icon-${size}.png`);
});

// Create maskable icons
maskableSizes.forEach(size => {
  const png = createMinimalPNG(size, size);
  const pngPath = path.join(iconsDir, `icon-${size}-maskable.png`);
  fs.writeFileSync(pngPath, png);
  console.log(`Created: icon-${size}-maskable.png`);
});

console.log('PNG icons created successfully!');
