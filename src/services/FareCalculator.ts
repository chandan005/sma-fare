import { fareCaps, fareRules, peakHours } from '../helpers/constants';
import { Journey } from '../interfaces/Journey';

// Keeps track of daily and weekly cumulative fares.
const dailyCumulativeFares: { [line: string]: { [date: string]: number } } = {};
const weeklyCumulativeFares: { [line: string]: { [weekStart: string]: number } } = {};

/**
 * Function to check if a given date and time falls within peak hours
 * @param dateTime
 * @returns boolean
 */
function isPeakHour(date: Date): boolean {
  const day = date.getUTCDay();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const dayPeakHours = peakHours[day];

  if (!dayPeakHours) {
    return false;
  }

  for (const { start, end } of dayPeakHours) {
    if (currentTime >= start && currentTime <= end) {
      return true;
    }
  }

  return false;
}

/**
 * Function to apply fare caps for a journey
 * @param totalFare
 * @param journey
 * @returns number
 */
function applyFareCaps(totalFare: number, journey: Journey): number {
  const { fromLine, toLine, dateTime: journeyDate } = journey;

  if (!dailyCumulativeFares[fromLine]) {
    dailyCumulativeFares[fromLine] = {};
  }

  if (!weeklyCumulativeFares[fromLine]) {
    weeklyCumulativeFares[fromLine] = {};
  }

  // Set Daily and Weekly
  const dailyCumulativeFare = dailyCumulativeFares[fromLine][journeyDate.toDateString()] || 0;
  const weekStart = new Date(journeyDate);
  weekStart.setDate(weekStart.getDate() - journeyDate.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weeklyCumulativeFare = weeklyCumulativeFares[fromLine][weekStart.toDateString()] || 0;

  const fareCap = fareCaps.find((cap) => cap.fromLine === fromLine && cap.toLine === toLine);

  if (!fareCap) {
    throw new Error(`No fare cap found for journey from ${fromLine} to ${toLine}`);
  }

  // Calculate the remaining allowance based on daily and weekly caps
  const dailyRemaining = fareCap.dailyCap - dailyCumulativeFare;
  const weeklyRemaining = fareCap.weeklyCap - weeklyCumulativeFare;

  // Apply the fare cap based on the remaining allowance
  const cappedFare = Math.min(totalFare, dailyRemaining, weeklyRemaining);

  dailyCumulativeFares[fromLine][journeyDate.toDateString()] = dailyCumulativeFare + cappedFare;
  weeklyCumulativeFares[fromLine][weekStart.toDateString()] = weeklyCumulativeFare + cappedFare;
  return cappedFare;
}

/**
 * Function to calculate total fare for all journeys
 * @param journeys
 * @returns number
 */
function calculateTotalFare(journeys: Journey[]): number {
  let totalFare = 0;

  for (const journey of journeys) {
    const fareRule = fareRules.find(
      (rule) => rule.fromLine === journey.fromLine && rule.toLine === journey.toLine
    );

    if (!fareRule) {
      throw new Error(
        `No fare rule found for journey from ${journey.fromLine} to ${journey.toLine}`
      );
    }

    const isPeak = isPeakHour(journey.dateTime);

    const baseFare = isPeak ? fareRule.peak : fareRule.nonPeak;

    const cappedFare = applyFareCaps(baseFare, journey);
    totalFare += cappedFare;
  }
  return totalFare;
}

export { calculateTotalFare };
