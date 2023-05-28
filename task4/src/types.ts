export type PublicHoliday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
};

export type PublicHolidayShort = Pick<PublicHoliday, 'name' | 'date' | 'localName'>;

export type LongWeekend = {
  startDate: string;
  endDate: string;
  dayCount: number;
  needBridgeDay: boolean;
};
