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
    const dateTime = new Date(record.DateTime.trim());

    journeys.push({ fromLine, toLine, dateTime });
  }
  return journeys;
}
