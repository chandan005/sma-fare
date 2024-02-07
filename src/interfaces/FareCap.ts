import { LineType } from '../enums/LineType';

export interface FareCap {
  fromLine: LineType;
  toLine: LineType;
  dailyCap: number;
  weeklyCap: number;
}
