import { exec } from 'child_process';
import path from 'path';

// Path to the test file relative to the project root
const testFilePath = path.join(__dirname, 'auth.test.ts');

// Command to run the TypeScript file directly with ts-node
const command = `npx ts-node-esm ${testFilePath}`;

console.log('Running auth tests...');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  
  console.log(stdout);
}); 