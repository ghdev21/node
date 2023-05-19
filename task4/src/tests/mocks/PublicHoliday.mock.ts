import {PublicHoliday} from '../../types';

const PublicHolidayMock: PublicHoliday = {
    date: '2023-04-10',
    localName: 'Lundi de Pâques',
    name: 'Easter Monday',
    countryCode: 'FR',
    fixed: false,
    global: true,
    counties: null,
    launchYear: 1642,
    types: ['Public']
};

const PublicHolidaysListMock: PublicHoliday[] = [
    {
        date: '2023-01-01',
        localName: "Jour de l'an",
        name: "New Year's Day",
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: 1967,
        types: ['Public']
    },
    {
        date: '2023-04-10',
        localName: 'Lundi de Pâques',
        name: 'Easter Monday',
        countryCode: 'FR',
        fixed: false,
        global: true,
        counties: null,
        launchYear: 1642,
        types: ['Public']
    },
    {
        date: '2023-05-01',
        localName: 'Fête du Travail',
        name: 'Labour Day',
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-05-08',
        localName: 'Victoire 1945',
        name: 'Victory in Europe Day',
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-05-18',
        localName: 'Ascension',
        name: 'Ascension Day',
        countryCode: 'FR',
        fixed: false,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-05-29',
        localName: 'Lundi de Pentecôte',
        name: 'Whit Monday',
        countryCode: 'FR',
        fixed: false,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-07-14',
        localName: 'Fête nationale',
        name: 'Bastille Day',
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
]

export {
    PublicHolidayMock,
    PublicHolidaysListMock
}
