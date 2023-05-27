export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}
export const NOT_FOUND = 'Sorry, page not found';

export const BASE_URL = 'http://localhost:3000';

export enum URLPathNames{
    BASE = '/',
    USERS = '/users',
    USER = '/users/'
}

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
}

export const ERRORS = {
    notFound: 'Page is not found'
}
