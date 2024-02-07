import { fareCaps, fareRules, peakHours } from '../helpers/constants';
import { Journey } from '../interfaces/Journey';

const dailyCumulativeFares: { [line: string]: { [date: string]: number } } = {};
const weeklyCumulativeFares: { [line: string]: number } = {};

/**
 * Function to check if a given date and time falls within peak hours
 * @param dateTime
 * @returns boolean
 */

function isPeakHour(date: Date): boolean {
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dayPeakHours = peakHours[day];

  if (!dayPeakHours) {
    return false;
  }

  for (const { start, end } of dayPeakHours) {
    if (time >= start && time <= end) {
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
 * @param journey
 * @returns number
 */
// Apply fare caps based on daily and weekly limits
function applyFareCaps(totalFare: number, journey: Journey): number {
  const { fromLine, toLine, dateTime } = journey;
  // Check if daily cumulative fare map for the line exists, if not initialize it
  if (!dailyCumulativeFares[fromLine]) {
    dailyCumulativeFares[fromLine] = {};
  }

  // Check if weekly cumulative fare map for the line exists, if not initialize it
  if (!weeklyCumulativeFares[fromLine]) {
    weeklyCumulativeFares[fromLine] = 0;
  }

  // Get the cumulative fare for the day for the line
  const dailyCumulativeFare = dailyCumulativeFares[fromLine][dateTime.toDateString()] || 0;
  // Get the cumulative fare for the week for the line
  const weeklyCumulativeFare = weeklyCumulativeFares[fromLine] || 0;

  // Find fare cap for the journey
  const fareCap = fareCaps.find((cap) => cap.fromLine === fromLine && cap.toLine === toLine);

  if (!fareCap) {
    throw new Error(`No fare cap found for journey from ${fromLine} to ${toLine}`);
  }

  // Check if the journey is within same line or different lines
  const isSameLine = fromLine === toLine;

  // Select fare cap based on whether cumulative fares exceed daily or weekly limits
  const dailyCapExceeded = dailyCumulativeFare >= fareCap.dailyCap;
  const weeklyCapExceeded = weeklyCumulativeFare >= fareCap.weeklyCap;

  // Apply fare cap if the limits are not exceeded
  let cappedFare = 0;
  if (!dailyCapExceeded && !weeklyCapExceeded) {
    cappedFare = totalFare;
  }

  // Update cumulative fare for the day for the line
  dailyCumulativeFares[fromLine][dateTime.toDateString()] = dailyCumulativeFare + cappedFare;
  // Update cumulative fare for the week for the line
  weeklyCumulativeFares[fromLine] = weeklyCumulativeFare + cappedFare;

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
