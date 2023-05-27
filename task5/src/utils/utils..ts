import {IncomingMessage} from "http";
import {IUser} from "../types/UserTypes";

const USERNAME_REGEXP = /.+/;
const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const generateId = (length: number = 8): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...new Array(length)].reduce((acc) => {
        const randomIndex = Math.floor(Math.random() * characters.length)
        return acc + characters.charAt(randomIndex)
    }, '');

}

const makeUserDTO = (data: IUser): IUser => ({
    name: data.name,
    email: data.email,
    // hobbies: data.hobbies
})

interface IValidationMapping {
    [key: string]: {
        validationFn: (value: any) => boolean;
        error: string;
    };
}

const userValidationMapping: IValidationMapping = {
    name: {
        validationFn: (value: string) => USERNAME_REGEXP.test(value),
        error: 'Name is required.',
    },
    email: {
        validationFn: (value: string) => EMAIL_REGEXP.test(value),
        error: 'Invalid email format.',
    },
    hobbies: {
        validationFn: (value: any) => Array.isArray(value) && value.every((item: any) => typeof item === "string"),
        error: 'Hobbies should contain only string values.',
    },
};

const validateFields = (userValidationMapping: IValidationMapping, data: IUser): [string, string][] =>
    Object.entries(data).reduce(
        (errors: [string, string][], [key, value]) => {
            const { validationFn, error } = userValidationMapping[key as keyof IUser];

            return !validationFn(value) ? [...errors, [key, error]] : errors;
        },
        []
    );


export const validateUserFields = validateFields.bind(null, userValidationMapping);

export const getRequestBody = async (req: IncomingMessage): Promise<IUser> => {
    return await new Promise<IUser>((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
           try{
               const userDTO: IUser = makeUserDTO(JSON.parse(data));
               resolve(userDTO);
           } catch (err){
               console.error(err)
               reject(new Error('Invalid data format: expected JSON'))
           }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
};
