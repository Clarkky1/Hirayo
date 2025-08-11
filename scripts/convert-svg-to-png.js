const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Convert SVG to PNG using sharp
const svgPath = path.join(__dirname, '../assets/splash/H.svg');
const pngPath = path.join(__dirname, '../assets/images/h-logo.png');

async function convertSvgToPng() {
  try {
    // Read the SVG content
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create a simple SVG wrapper with background
    const svgWithBackground = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0066cc" rx="20"/>
        <g transform="translate(21, 29.5)">
          ${svgContent.replace('<svg width="158" height="141" viewBox="0 0 158 141" fill="none" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}
        </g>
      </svg>
    `;
    
    // Convert to PNG using sharp
    await sharp(Buffer.from(svgWithBackground))
      .png()
      .resize(200, 200)
      .toFile(pngPath);
    
    console.log('Successfully converted SVG to PNG:', pngPath);
    console.log('You can now update your app.json to use this PNG as the splash screen');
    
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

convertSvgToPng();
