import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

program
  .name('mtcars')
  .description('Програма для аналізу даних автомобілів (mtcars.json)')
  .version('1.0.0');

program
  .option('-i, --input <path>', 'шлях до файлу для читання') 
  .option('-o, --output [path]', 'шлях до файлу для запису результату') 
  .option('-d, --display', 'вивести результат у консоль')
  .option('-c, --cylinders', 'відображати кількість циліндрів')
  .option('-m, --mpg <value>', 'показувати тільки авто з mpg нижче зазначеного значення');

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

let data;
try {
  const fileContent = fs.readFileSync(options.input, 'utf-8');
  data = JSON.parse(fileContent);
} catch (err) {
  console.error('Cannot read or parse input file');
  process.exit(1);
}

let carsArray = Array.isArray(data) ? data : data.mtcars;

if (!Array.isArray(carsArray)) {
  console.error('Invalid format: expected array in mtcars');
  process.exit(1);
}

let filtered = carsArray;
if (options.mpg) {
  const mpgLimit = parseFloat(options.mpg);
  filtered = filtered.filter(car => car.mpg < mpgLimit);
}

const outputLines = filtered.map(car => {
  const cylPart = options.cylinders ? ` ${car.cyl}` : '';
  return `${car.model}${cylPart} ${car.mpg}`;
});

if (options.display) {
  console.log(outputLines.join('\n'));
}

if (typeof options.output === 'string' && options.output.trim() !== '') {
  try {
    fs.writeFileSync(options.output, outputLines.join('\n'), 'utf-8');
  } catch (err) {
    console.error('Cannot write to output file');
    process.exit(1);
  }
}

if (!options.display && !options.output) {
  process.exit(0);
}
