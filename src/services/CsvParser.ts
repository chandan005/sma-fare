import { parse } from 'csv-parse';
import fs from 'fs';
import { Journey } from '../interfaces/Journey';

export async function parseCSV(filePath: string): Promise<Journey[]> {
  const journeys: Journey[] = [];

  // Reading and parsing csv file
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  parser.forEach((record: any) => {
    const fromLine = record.fromLine.trim();
    const toLine = record.toLine.trim();
    const dateTime = record.dateTime.trim();

    const journey: Journey = { fromLine, toLine, dateTime };
    journeys.push(journey);
  });
  return journeys;
}
