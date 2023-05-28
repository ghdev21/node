import request from "supertest";
import {PUBLIC_HOLIDAYS_API_URL} from "../config";

interface ApiResponse<T> {
    status: number;
    body: T;
}

interface LongWeekend {
    startDate: string,
    endDate: string,
    dayCount: number,
    needBridgeDay: boolean
}

interface AvailableCountries {
    countryCode: string,
    name: string,
}

interface CountryInfo {
    commonName: string,
    officialName: string,
    countryCode: string,
    region: string,
    borders: [
        CountryInfo
    ]
}

describe('LongWeekend', () => {
    it('should return status 200 and list of long weekends ', async () => {
        const {
            status,
            body
        }: ApiResponse<LongWeekend[]> = await request(PUBLIC_HOLIDAYS_API_URL).get('/LongWeekend/2023/UA');

        expect(status).toEqual(200);

        body.forEach((_) => expect({
            startDate: expect.any(String),
            endDate: expect.any(String),
            dayCount: expect.any(Number),
            needBridgeDay: expect.any(Boolean)
        }))
    });
})

describe('County', () => {
    it('should return status 200 and available countries', async () => {
        const {
            status,
            body
        }: ApiResponse<AvailableCountries[]> = await request(PUBLIC_HOLIDAYS_API_URL).get('/AvailableCountries');

        expect(status).toEqual(200);

        body.forEach((_) => expect({
            countryCode: expect.any(String),
            name: expect.any(String),
        }))
    });

    it('should return status 200 and country info based on locale', async () => {
        const {
            status,
            body
        }: ApiResponse<CountryInfo> = await request(PUBLIC_HOLIDAYS_API_URL).get('/CountryInfo/UA');

        expect(status).toEqual(200);

        expect(body).toEqual({
            commonName: expect.any(String),
            officialName: expect.any(String),
            countryCode: expect.any(String),
            region: expect.any(String),
            borders: expect.any(Array),
        })
    });
})

