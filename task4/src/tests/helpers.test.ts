import {shortenPublicHoliday, validateInput} from '../helpers'
import {PublicHolidayShort} from "../types";
import {PublicHolidayMock} from "./mocks/PublicHoliday.mock";
import {SUPPORTED_COUNTRIES} from "../config";

describe('helpers', () => {
    it('should return short version of PublicHoliday', () => {
        const publicHolidayShort: PublicHolidayShort = shortenPublicHoliday(PublicHolidayMock);

        expect(publicHolidayShort).toEqual({
            name: PublicHolidayMock.name,
            localName: PublicHolidayMock.localName,
            date: PublicHolidayMock.date,
        });
    })

    describe('validateInput', () => {
        it('returns true if params are valid', () => {
            const isInputValid = validateInput({year: 2023, country: SUPPORTED_COUNTRIES[0]})

            expect(isInputValid).toBe(true)
        })

        it('throws error if year is not current', () => {
            const nextYear = 2025;
            const validateWrapper = () => validateInput({year: nextYear, country: SUPPORTED_COUNTRIES[0]})

            expect(validateWrapper).toThrow(new Error(`Year provided not the current, received: ${nextYear}`))
        })

        it('throws error if country is not supported ', () => {
            const notSupportedCountryCode = 'US';
            const validateWrapper = () => validateInput({year: 2023, country: notSupportedCountryCode})

            expect(validateWrapper).toThrow(new Error(`Country provided is not supported, received: ${notSupportedCountryCode}`))
        })
    })
})
