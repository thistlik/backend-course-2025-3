import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

program
  .name('nbu-reader')
  .description('Програма для читання JSON-файлу з даними НБУ')
  .version('1.0.0');


program
  .option('-i, --input <path>', 'шлях до файлу для читання')      // обовʼязковий
  .option('-o, --output [path]', 'шлях до файлу для запису результату') // необовʼязковий, перевіряємо вручну
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

if (options.output === true || (typeof options.output === 'string' && options.output.trim() === '')) {
  console.error('Please, specify output file path');
  process.exit(1);
}

let result;
try {
  const data = fs.readFileSync(options.input, 'utf-8');
  result = JSON.parse(data);
} catch (err) {
  console.error('Cannot read or parse input file');
  process.exit(1);
}

const hasOutput = typeof options.output === 'string' && options.output.trim() !== '';
const hasDisplay = options.display === true;

if (!hasOutput && !hasDisplay) {
  process.exit(0);
}

if (hasDisplay) {
  console.log(result);
}

if (hasOutput) {
  try {
    fs.writeFileSync(options.output, JSON.stringify(result, null, 2), 'utf-8');
  } catch (err) {
    console.error('Cannot write to output file');
    process.exit(1);
  }
}
