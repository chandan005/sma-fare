import { LineType } from '../src/enums/LineType';
import { Journey } from '../src/interfaces/Journey';
import { calculateTotalFare } from '../src/services/FareCalculator';

describe('Fare Calculation Tests', () => {
  it('Basic Fare Calculation', () => {
    const journeys: Journey[] = [
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-01T11:00:00Z'),
      },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(1);
  });

  it('Daily Fare Cap', () => {
    const journeys: Journey[] = [
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T07:00:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T07:20:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T07:30:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T08:20:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T08:30:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T08:45:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T09:47:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T09:50:00Z') },
      { fromLine: LineType.Red, toLine: LineType.Red, dateTime: new Date('2024-02-06T09:59:00Z') },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(12);
  });

  it('Weekly Fare Cap', () => {
    const journeys: Journey[] = [
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-01-29T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-01-30T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-01-31T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-01T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-02T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-03T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-04T08:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-05T08:00:00Z'),
      },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(13);
  });

  it('Peak Hour Fare Calculation', () => {
    const journeys: Journey[] = [
      {
        fromLine: LineType.Red,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-06T09:00:00Z'),
      },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(3);
  });

  it('Different Line Fare Calculation', () => {
    const journeys: Journey[] = [
      {
        fromLine: LineType.Green,
        toLine: LineType.Red,
        dateTime: new Date('2024-02-01T14:00:00Z'),
      },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(3);
  });

  it('Peak Hour Different Line Fare Calculation', () => {
    const journeys: Journey[] = [
      {
        fromLine: LineType.Green,
        toLine: LineType.Red,
        dateTime: new Date('2024-02-06T18:30:00Z'),
      },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(4);
  });

  it('Multiple Journeys Same Day', () => {
    const journeys: Journey[] = [
      {
        fromLine: LineType.Red,
        toLine: LineType.Red,
        dateTime: new Date('2024-02-01T08:30:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Green,
        dateTime: new Date('2024-02-01T12:00:00Z'),
      },
      {
        fromLine: LineType.Green,
        toLine: LineType.Red,
        dateTime: new Date('2024-02-01T16:00:00Z'),
      },
    ];

    const totalFare = calculateTotalFare(journeys);
    expect(totalFare).toBe(7);
  });
});
