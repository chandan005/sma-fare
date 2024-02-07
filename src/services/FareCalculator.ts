import { LineType } from '../enums/LineType';
import { fareCaps, fareRules, peakHourRanges } from '../helpers/constants';
import { FareCap } from '../interfaces/FareCap';
import { Journey } from '../interfaces/Journey';

/**
 * Function to check if a given date and time falls within peak hours
 * @param dateTime
 * @returns boolean
 */
function isPeakHour(dateTime: Date): boolean {
  const dayOfWeek = dateTime.getDay();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();

  for (const range of peakHourRanges) {
    if (
      (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= range.startHour && hour < range.endHour) || // Monday to Friday
      (dayOfWeek === 6 &&
        ((hour >= range.startHour && hour < range.endHour) || // Saturday
          (hour === range.endHour && minute === 0))) || // Include the end hour for Saturday
      (dayOfWeek === 0 && hour >= range.startHour && hour < range.endHour) // Sunday
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Function to calculate the fare for a journey based on fare rules
 * @param journey
 * @returns number
 */
function calculateFare(journey: Journey): number {
  const { fromLine, toLine, dateTime } = journey;

  const isPeak = isPeakHour(dateTime);

  // Find fare rule for the journey
  const fareRule = fareRules.find((rule) => rule.fromLine === fromLine && rule.toLine === toLine);

  if (!fareRule) {
    throw new Error(`No fare rule found for journey from ${fromLine} to ${toLine}`);
  }

  const fare = isPeak ? fareRule.peak : fareRule.nonPeak;

  return fare;
}

/**
 * Function to apply fare caps for a journey
 * @param totalFare
 * @param fromLine
 * @param toLine
 * @returns number
 */
function applyFareCaps(totalFare: number, fromLine: LineType, toLine: LineType): number {
  const fareCap: FareCap | undefined = fareCaps.find(
    (rule) => rule.fromLine === fromLine && rule.toLine === toLine
  );

  if (!fareCap) {
    throw new Error(`No fare cap found for journey from ${fromLine} to ${toLine}`);
  }

  // Select fare cap based on whether it's same line or different lines
  const cap = fromLine === toLine ? fareCap.dailyCap : fareCap.weeklyCap;

  // Apply fare cap
  const cappedFare = Math.min(totalFare, cap);

  return cappedFare;
}

/**
 * Function to calculate total fare for all journeys
 * @param journeys
 * @returns number
 */
function calculateTotalFare(journeys: Journey[]): number {
  let totalFare = 0;

  // Calculate fare for each journey and accumulate total fare
  journeys.forEach((journey) => {
    const fare = calculateFare(journey);
    totalFare += fare;
  });

  // Check if any journey falls within peak hours
  const anyPeakHourJourney = journeys.some((journey) => isPeakHour(journey.dateTime));

  // Apply fare cap if any journey falls within peak hours
  if (anyPeakHourJourney) {
    journeys.forEach((journey) => {
      const fare = calculateFare(journey);
      const cappedFare = applyFareCaps(fare, journey.fromLine, journey.toLine);
      totalFare += cappedFare - fare; // Add the difference between capped fare and original fare
    });
  }

  return totalFare;
}

export { calculateTotalFare };
