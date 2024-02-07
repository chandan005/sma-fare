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

export const peakHours: { [day: string]: { start: string; end: string }[] } = {
  Monday: [
    { start: '08:00', end: '10:00' },
    { start: '16:30', end: '19:00' },
  ],
  Tuesday: [
    { start: '08:00', end: '10:00' },
    { start: '16:30', end: '19:00' },
  ],
  Wednesday: [
    { start: '08:00', end: '10:00' },
    { start: '16:30', end: '19:00' },
  ],
  Thursday: [
    { start: '08:00', end: '10:00' },
    { start: '16:30', end: '19:00' },
  ],
  Friday: [
    { start: '08:00', end: '10:00' },
    { start: '16:30', end: '19:00' },
  ],
  Saturday: [
    { start: '10:00', end: '14:00' },
    { start: '18:00', end: '23:00' },
  ],
  Sunday: [{ start: '18:00', end: '23:00' }],
};
