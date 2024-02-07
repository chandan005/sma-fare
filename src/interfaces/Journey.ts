import { LineType } from '../enums/LineType';

export interface Journey {
  fromLine: LineType;
  toLine: LineType;
  dateTime: Date;
}
