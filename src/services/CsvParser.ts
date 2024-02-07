import { parse } from 'csv-parse';
import fs from 'fs';
import { Journey } from '../interfaces/Journey';

export async function parseCSV(filePath: string): Promise<Journey[]> {
  const journeys: Journey[] = [];

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  for await (const record of parser) {
    const fromLine = record.FromLine.trim();
    const toLine = record.ToLine.trim();
    let dateTimeString = record.DateTime.trim();

    // Append 'Z' to indicate UTC time if not already present
    if (!dateTimeString.endsWith('Z')) {
      dateTimeString += 'Z';
    }

    const dateTimeUTC = new Date(dateTimeString);
    journeys.push({ fromLine, toLine, dateTime: dateTimeUTC });
  }
  return journeys;
}
