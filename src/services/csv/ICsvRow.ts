import { LineType } from '../../enums/LineType';

export interface ICsvRow {
  FromLine: LineType;
  ToLine: LineType;
  DateTime: Date;
}
