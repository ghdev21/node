export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export const BASE_URL = 'http://localhost:3000';
export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
}

export const errors = {
    notFound: 'Sorry, page not found',
    unableFindUser: (id: string) => `Unable to find the user with following id: ${id}`,
    unableDeleteUser: (id: string) => `User with ID: ${id} has not been deleted`,
    userExists: (email: string) => `The user with following email: ${email} already exists`,
    unableAddHobby: (id: string) =>`Unable to add hobbies to the user with following id: ${id}`,
    unableGetHobby: (id: string) =>`Unable to get hobbies for the user with following id: ${id}`,
    unableDeleteHobby: (id: string) =>`Unable to delete hobby for user ${id}`,
    somethingWentWrong: 'Oops something went wrong',
    parsingError: 'Unable to parse data',
}
export const parserPatterns = {
    users: /^\/users$/,
    userSubRoute: /^\/users\/([\w-]+)$/,
    userHobbies: /^\/users\/([\w-]+)\/hobbies$/,
}
