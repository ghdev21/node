import {IncomingMessage} from "http";
import {IExtendedUser, IUser} from "../types/UserTypes";


export interface IValidationMapping<T> {
    [key: string]: {
        validationFn: (value: any) => boolean;
        error: string;
    };
}

export type IHobbiesResponse = Pick<IUser, 'hobbies'>
export type IUserResponse = Omit<IUser, 'hobbies'>

const USERNAME_REGEXP = /^[A-Za-z]+$/;
const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const generateId = (length: number = 8): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...new Array(length)].reduce((acc) => {
        const randomIndex = Math.floor(Math.random() * characters.length)
        return acc + characters.charAt(randomIndex)
    }, '');
}
export const makeUserDTO = (data: IUserResponse): Pick<IUser, 'name' | 'email'> => ({
    name: data.name,
    email: data.email,
});

export const makeUserUpdateDTO = (data: IUserResponse): Pick<IUser, 'name' | 'email'> => {
    const userDTO: {email?: string, name?: string} = {};
    // fast workaround to make the fields available for partial update
    if (data.email) {
        userDTO.email = data.email;
    }

    if (data.name) {
        userDTO.name = data.name;
    }
    return userDTO as Pick<IUser, 'name' | 'email'>
};

const userValidationMapping: IValidationMapping<IUser> = {
    name: {
        validationFn: (value: string) => !!value && USERNAME_REGEXP.test(value),
        error: 'Name should have only letters and be not empty',
    },
    email: {
        validationFn: (value: string) => EMAIL_REGEXP.test(value),
        error: 'Invalid email format.',
    },
};

const hobbiesValidationMapping: IValidationMapping<IUser> = {
    hobbies: {
        validationFn: (value: string[]):boolean =>
            Array.isArray(value)
            && value.length > 0
            && value.every((item: any) => typeof item === "string")
        ,
        error: 'Hobbies should contain only string values',
    },
}

const validateFields = <T>(validationMapping: IValidationMapping<T>, data: T): [string, string][] =>
    Object.entries(data as object).reduce(
        (errors: [string, string][], [key, value]) => {
            const { validationFn, error } = validationMapping[key];

            return !validationFn(value) ? [...errors, [key, error]] : errors;
        },
        []
    );

export const validateUserFields = validateFields.bind(null, userValidationMapping);
export const validateHobbies = validateFields.bind(null, hobbiesValidationMapping);
export const getRequestBody = async <T>(req: IncomingMessage): Promise<T> => {
    return await new Promise<T>((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch (err) {
                console.error(err);
                reject(new Error('Invalid data format: expected JSON'));
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
};
export const shortenUser = (user: IExtendedUser): Omit<IExtendedUser, 'hobbies'> => {
    const {hobbies, ...rest} = user;

    return rest
}
