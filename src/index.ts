import { Command } from 'commander';
import figlet from 'figlet';
import * as fs from 'fs';
import { parseCSV } from './services/CsvParser';
import { calculateTotalFare } from './services/FareCalculator';

// const program = new Command();
// program
//   .description('SMS Fare Command Line Application.')
//   .arguments('<file>')
//   .action(async (file) => {
//     if (!fs.existsSync(file)) {
//       console.error('Error: The specified file does not exist.');
//       process.exit(1);
//     }
//     const journeys = await parseCSV(file);
//     console.log(journeys);
//     if (journeys && journeys.length > 0) {
//       const totalFare = calculateTotalFare(journeys);
//       console.log(`Total fare: ${totalFare}`);
//     } else {
//       console.log('No journeys were parsed from the csv file.');
//     }
//   })
//   .parse(process.argv);

// program.parse(process.argv);

async function run() {
  figlet('Singa Metro Authority', (err, data) => {
    if (err) {
      console.log('Error occurred while displaying ASCII:', err);
    }
    console.log(data);
    console.log('Welcome to Singa Metro Authority Payment System\n');

    const program = new Command();

    program
      .name('Singa Metro Fare Calculator')
      .description('Singa Metro Authority Payment System CLI')
      .version('1.0.0')
      .option('-f, --file <path>', 'Path to input CSV file')
      .arguments('<file>')
      .action(async (file) => {
        if (!fs.existsSync(file)) {
          console.error('Error: The specified file does not exist.');
          process.exit(1);
        }
        const journeys = await parseCSV(file);
        if (journeys && journeys.length > 0) {
          const totalFare = calculateTotalFare(journeys);
          console.log(`Total fare: ${totalFare}`);
        } else {
          console.log('No journeys were parsed from the csv file.');
        }
      })
      .parse(process.argv);
  });
}

run().catch((error) => {
  console.error('An error occurred:', error);
});
