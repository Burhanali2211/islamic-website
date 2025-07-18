#!/usr/bin/env node

/**
 * Fix for empty grape.js file in lucide-react package
 * This script patches the empty grape.js file with a proper icon implementation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const grapeFilePath = path.join(__dirname, '..', 'node_modules', 'lucide-react', 'dist', 'esm', 'icons', 'grape.js');

const grapeIconContent = `/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

import createLucideIcon from '../createLucideIcon.js';

const __iconNode = [
  ["circle", { cx: "12", cy: "5", r: "2", key: "1" }],
  ["circle", { cx: "8", cy: "8", r: "2", key: "2" }],
  ["circle", { cx: "16", cy: "8", r: "2", key: "3" }],
  ["circle", { cx: "6", cy: "12", r: "2", key: "4" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "5" }],
  ["circle", { cx: "18", cy: "12", r: "2", key: "6" }],
  ["circle", { cx: "8", cy: "16", r: "2", key: "7" }],
  ["circle", { cx: "16", cy: "16", r: "2", key: "8" }],
  ["circle", { cx: "12", cy: "20", r: "2", key: "9" }]
];
const Grape = createLucideIcon("grape", __iconNode);

export { __iconNode, Grape as default };
//# sourceMappingURL=grape.js.map
`;

try {
  if (fs.existsSync(grapeFilePath)) {
    const currentContent = fs.readFileSync(grapeFilePath, 'utf8');
    
    // Check if the file is empty or doesn't have proper exports
    if (currentContent.trim().length === 0 || !currentContent.includes('export')) {
      fs.writeFileSync(grapeFilePath, grapeIconContent);
      console.log('✅ Fixed empty grape.js file in lucide-react');
    } else {
      console.log('✅ grape.js file is already properly configured');
    }
  } else {
    console.log('⚠️  grape.js file not found, skipping fix');
  }
} catch (error) {
  console.error('❌ Error fixing grape.js file:', error.message);
}
