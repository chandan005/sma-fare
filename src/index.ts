import { Command } from 'commander';
import figlet from 'figlet';

const program = new Command()
program
  .description('SMS Fare Command Line Application.')
  .action((name: string) => {
    figlet.text('Hello ' + name, (err, data) => {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
    });
  });

// Parse command line arguments
program.parse(process.argv);
