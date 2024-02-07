import { Command } from 'commander';
import * as fs from 'fs';
import { convertCSVtoJSON } from './services/csv/CsvParser';

const program = new Command();
program
  .description('SMS Fare Command Line Application.')
  .arguments('<file>')
  .action(async (file) => {
    if (!fs.existsSync(file)) {
      console.error('Error: The specified file does not exist.');
      process.exit(1);
    }
    console.log('New and Hello');
    console.log(await convertCSVtoJSON(file));
  })
  .parse(process.argv);
