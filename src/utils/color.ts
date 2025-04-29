/**
 * Interpolates between two colors based on a ratio.
 * 
 * @param color1 The first color in hex format (e.g., "#000000")
 * @param color2 The second color in hex format (e.g., "#FFFFFF")
 * @param ratio A value between 0 and 1 representing the blend ratio (0 = color1, 1 = color2)
 * @returns The blended color in hex format
 */
export function blendColor(color1: string, color2: string, ratio: number): string {
  // Ensure ratio is between 0 and 1
  const normalizedRatio = Math.min(1, Math.max(0, ratio));
  
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    console.error('Invalid color format. Expected hex colors like "#RRGGBB"');
    return color1;
  }
  
  // Interpolate between the RGB values
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * normalizedRatio);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * normalizedRatio);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * normalizedRatio);
  
  // Convert back to hex
  return rgbToHex(r, g, b);
}

/**
 * Converts a hex color string to RGB values.
 * 
 * @param hex Hex color string (e.g., "#RRGGBB" or "#RGB")
 * @returns An object with r, g, b properties or null if invalid
 */
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  // Remove the # if present
  const sanitizedHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  // Convert shorthand (3 digits) to full form (6 digits)
  const fullHex = sanitizedHex.length === 3
    ? sanitizedHex.split('').map(c => c + c).join('')
    : sanitizedHex;
  
  // Validate the hex string
  const isValidHex = /^[0-9A-Fa-f]{6}$/.test(fullHex);
  if (!isValidHex) {
    return null;
  }
  
  // Extract RGB components
  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Converts RGB values to a hex color string.
 * 
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Hex color string in the format "#RRGGBB"
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/**
 * Converts a single color component to its hex representation.
 * 
 * @param c Color component (0-255)
 * @returns Two-character hex string
 */
function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

/**
 * Creates a transparent version of a color by applying an alpha value.
 * 
 * @param color The base color in hex format (e.g., "#RRGGBB")
 * @param alpha The alpha/opacity value (0-1)
 * @returns RGBA color string (e.g., "rgba(r, g, b, a)")
 */
export function withAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) {
    console.error('Invalid color format. Expected hex color like "#RRGGBB"');
    return `rgba(0, 0, 0, ${alpha})`;
  }
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Checks if a color is light or dark.
 * 
 * @param color The color in hex format
 * @returns Boolean indicating if the color is light (true) or dark (false)
 */
export function isLightColor(color: string): boolean {
  const rgb = hexToRgb(color);
  if (!rgb) return false;
  
  // Calculate perceptive luminance (based on human eye's sensitivity to colors)
  // Formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Typically, luminance > 0.5 is considered "light"
  return luminance > 0.5;
}

/**
 * Generates a complementary color.
 * 
 * @param color The base color in hex format
 * @returns The complementary color in hex format
 */
export function getComplementaryColor(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return '#000000';
  
  // Invert each component
  const r = 255 - rgb.r;
  const g = 255 - rgb.g;
  const b = 255 - rgb.b;
  
  return rgbToHex(r, g, b);
}