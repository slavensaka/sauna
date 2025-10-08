import { add } from './utils/math';

function main(): void {
  console.log('🚀 TypeScript Node.js App Started!');
  
  const a = 2;
  const b = 2;
  
  console.log(`${a} + ${b} = ${add(a, b)}`);
}

if (require.main === module) {
  main();
}

export { main };