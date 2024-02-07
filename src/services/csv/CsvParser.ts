import csvParser from 'csv-parser';
import fs from 'fs';

interface CSVRow {
  [key: string]: string;
}

function readCSVFile(filePath: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: CSVRow) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error: any) => {
        reject(error);
      });
  });
}

export async function convertCSVtoJSON(csvFilePath: string): Promise<string> {
  try {
    const rows = await readCSVFile(csvFilePath);
    return JSON.stringify(rows, null, 2);
  } catch (error) {
    throw new Error(`Error reading or converting CSV to JSON: ${error}`);
  }
}
