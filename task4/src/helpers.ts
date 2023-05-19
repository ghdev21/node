import { SUPPORTED_COUNTRIES } from './config';
import { PublicHoliday, PublicHolidayShort } from './types';

const validateCountry = (country: string) => {
  return SUPPORTED_COUNTRIES.includes(country);
};

const validateYear = (year: number) => {
  return year === new Date().getFullYear();
};

export const validateInput = ({ year, country }: { year?: number; country?: string }) => {
  if (country && !validateCountry(country)) {
    throw new Error(`Country provided is not supported, received: ${country}`);
  }

  if (year && !validateYear(year)) {
    throw new Error(`Year provided not the current, received: ${year}`);
  }

  return true;
};

export const shortenPublicHoliday = (holiday: PublicHoliday): PublicHolidayShort => {
  return {
    name: holiday.name,
    localName: holiday.localName,
    date: holiday.date,
  };
};
