import axios from 'axios';
import { PUBLIC_HOLIDAYS_API_URL } from '../config';
import { validateInput, shortenPublicHoliday } from '../helpers';
import { PublicHoliday, PublicHolidayShort } from '../types';

// Swagger https://date.nager.at/swagger/index.html

export const getListOfPublicHolidays = async (year: number, country: string): Promise<PublicHolidayShort[]> => {
  validateInput({ year, country });

  try {
    const { data: publicHolidays } = await axios.get<PublicHoliday[]>(
      `${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`,
    );
    return publicHolidays.map((holiday) => shortenPublicHoliday(holiday));
  } catch (error) {
    return [];
  }
};

export const checkIfTodayIsPublicHoliday = async (country: string) => {
  validateInput({ country });

  try {
    const { status } = await axios.get<PublicHoliday[]>(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`);
    return status === 200;
  } catch (error) {
    return false;
  }
};

export const getNextPublicHolidays = async (country: string): Promise<PublicHolidayShort[]> => {
  validateInput({ country });

  try {
    const { data: publicHolidays } = await axios.get<PublicHoliday[]>(
      `${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`,
    );
    return publicHolidays.map((holiday) => shortenPublicHoliday(holiday));
  } catch (error) {
    return [];
  }
};
