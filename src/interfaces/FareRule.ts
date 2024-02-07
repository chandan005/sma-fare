import { LineType } from '../enums/LineType';

export interface FareRule {
  fromLine: LineType;
  toLine: LineType;
  peak: number;
  nonPeak: number;
}
