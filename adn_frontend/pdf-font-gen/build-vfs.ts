import fs from 'fs';
import path from 'path';

const fontPath = path.resolve('./Roboto-Regular.ttf');
const base64Font = fs.readFileSync(fontPath, 'base64');

const fontDefinition = `
export const customVfs = {
  'Roboto-Regular.ttf': '${base64Font}'
};
`;

fs.writeFileSync('vfs_fonts.ts', fontDefinition, 'utf8');
console.log('✅ vfs_fonts.ts generated successfully!');
