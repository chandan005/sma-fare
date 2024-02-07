import { LineType } from '../enums/LineType';
import { FareCap } from '../interfaces/FareCap';
import { FareRule } from '../interfaces/FareRule';

export const fareRules: FareRule[] = [
  { fromLine: LineType.Green, toLine: LineType.Green, peak: 2, nonPeak: 1 },
  { fromLine: LineType.Red, toLine: LineType.Red, peak: 3, nonPeak: 2 },
  { fromLine: LineType.Green, toLine: LineType.Red, peak: 4, nonPeak: 3 },
  { fromLine: LineType.Red, toLine: LineType.Green, peak: 3, nonPeak: 2 },
];

export const fareCaps: FareCap[] = [
  { fromLine: LineType.Green, toLine: LineType.Green, dailyCap: 8, weeklyCap: 55 },
  { fromLine: LineType.Red, toLine: LineType.Red, dailyCap: 12, weeklyCap: 70 },
  { fromLine: LineType.Green, toLine: LineType.Red, dailyCap: 15, weeklyCap: 90 },
  { fromLine: LineType.Red, toLine: LineType.Green, dailyCap: 15, weeklyCap: 90 },
];

export const peakHourRanges: { startHour: number; endHour: number }[] = [
  { startHour: 8, endHour: 10 },
  { startHour: 16, endHour: 19 },
  { startHour: 10, endHour: 14 },
  { startHour: 18, endHour: 23 },
  { startHour: 18, endHour: 23 },
];
