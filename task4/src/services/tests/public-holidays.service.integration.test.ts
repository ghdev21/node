import {getListOfPublicHolidays, getNextPublicHolidays} from "../public-holidays.service";

import {SUPPORTED_COUNTRIES} from "../../config";
import {PublicHolidayShort} from "../../types";

export const checkIfShorterHoliday = <T extends PublicHolidayShort>(holiday: T): boolean => {
    const fields = ['name', 'localName', 'date'].sort();
    const shortPublicHolidayFields = Object.keys(holiday).sort();
    //simple workaround to compare two arrays
    return JSON.stringify(fields) === JSON.stringify(shortPublicHolidayFields);
}
const currentYear = new Date().getFullYear();

describe('public-holidays.service.integration', () => {
    describe('getListOfPublicHolidays integration', () => {
        it('should throw unsupported country error if country is not in SUPPORTED_COUNTRIES', async () => {
            const unsupportedCountry = 'US'
            await expect(getListOfPublicHolidays(currentYear, unsupportedCountry)).rejects.toThrow(new Error(`Country provided is not supported, received: ${unsupportedCountry}`))
        });

        it('should throw wrong year error if it is not current one', async () => {
            const previousYear = currentYear - 1
            await expect(getListOfPublicHolidays(previousYear, SUPPORTED_COUNTRIES[2])).rejects.toThrow(new Error(`Year provided not the current, received: ${previousYear}`))
        });

        it('should return shorten public holidays list', async () => {
            const shortPublicHolidaysList = await getListOfPublicHolidays(currentYear, SUPPORTED_COUNTRIES[0]);
            const isListShorten = shortPublicHolidaysList.every(checkIfShorterHoliday)

            expect(shortPublicHolidaysList.length).toBeGreaterThan(0);
            expect(isListShorten).toBe(true);
        });
    })

   describe('getNextPublicHolidays integration', () => {
       it('should return next shorten public holiday list', async () => {
           const nextShortPublicHoliday = await getNextPublicHolidays(SUPPORTED_COUNTRIES[1]);
           const isListShorten = nextShortPublicHoliday.every(checkIfShorterHoliday)

           expect(nextShortPublicHoliday.length).toBeGreaterThan(0);
           expect(isListShorten).toBe(true);
       });
   })
})
