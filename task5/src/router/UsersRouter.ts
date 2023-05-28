import {IncomingMessage, ServerResponse} from "http";
import {errors, HTTP_METHODS, HttpStatusCode, parserPatterns} from "./constants";
import {userService} from "../services/user.service";
import {
    getRequestBody,
    IUserResponse,
    makeUserDTO,
    makeUserUpdateDTO,
    shortenUser,
    validateUserFields
} from "../utils/utils.";
import {responseHandlerHTML, responseHandlerJSON, showNotFoundView} from "./route-handlers/not-found";
import {IUser} from "../types/UserTypes";

export const usersRouter = [
    {
        method: HTTP_METHODS.GET,
        pattern: parserPatterns.users,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
           try {
               const users = userService.getAllUsers();
               if(users.length){
                   return responseHandlerJSON(res, HttpStatusCode.OK, users.map(shortenUser));
               } else {
                   return responseHandlerJSON(res, HttpStatusCode.NO_CONTENT, []);
               }

           } catch (err){
               console.error(err);
              return responseHandlerHTML(res, HttpStatusCode.BAD_REQUEST, errors.somethingWentWrong)
           }
        }
    },
    {
        method: HTTP_METHODS.GET,
        pattern: parserPatterns.userSubRoute,
        handler: async (req: IncomingMessage, res: ServerResponse, id: string) => {
            try {
                const user = userService.getUserById(id);
                const links = [
                    {
                        rel: 'hobbies',
                        href: `/users/${id}/hobbies`,
                        method: 'GET'
                    }
                ];
                return responseHandlerJSON(res, HttpStatusCode.OK, {user: shortenUser(user!), links});
            } catch (err) {
                console.error(err);
                return showNotFoundView(res, errors.unableFindUser(id));
            }
        }
    },
    {
        method: HTTP_METHODS.POST,
        pattern: /^\/users$/,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
            try {
                const body = await getRequestBody<IUserResponse>(req);
                const user = makeUserDTO(body);
                const invalidFields = validateUserFields(user);

                if (invalidFields.length) {
                    return responseHandlerJSON(res, HttpStatusCode.UNPROCESSABLE_ENTITY, invalidFields);
                } else {
                    try {
                        const newUser = userService.createUser(user);
                        return responseHandlerJSON(res, HttpStatusCode.CREATED, newUser);
                    } catch (err) {
                        console.error(err);
                       return responseHandlerHTML(res, HttpStatusCode.CONFLICT, errors.userExists(body.email))
                    }
                }
            } catch (err) {
                console.error(err);
                return responseHandlerHTML(res, HttpStatusCode.UNPROCESSABLE_ENTITY, errors.parsingError)
            }
        },
    },
    {
        method: HTTP_METHODS.PUT,
        pattern: parserPatterns.userSubRoute,
        handler: async (req: IncomingMessage, res: ServerResponse, id: string) => {
            try {
                const data: IUser = await getRequestBody(req);
                const userDTO = makeUserUpdateDTO(data);
                const invalidFields = validateUserFields(userDTO);

                if (invalidFields.length) {
                    return responseHandlerJSON(res, HttpStatusCode.UNPROCESSABLE_ENTITY, invalidFields);
                } else {
                    try {
                        const newUser = userService.updateUser(id, userDTO);
                        return responseHandlerJSON(res, HttpStatusCode.OK, shortenUser(newUser!));
                    } catch (err) {
                        console.error(err);
                        responseHandlerHTML(res, HttpStatusCode.INTERNAL_SERVER_ERROR, errors.somethingWentWrong)
                    }
                }
            } catch (err) {
                console.error(err);
                responseHandlerHTML(res, HttpStatusCode.BAD_REQUEST, errors.parsingError)
            }
        }
    },
    {
        method: HTTP_METHODS.DELETE,
        pattern: parserPatterns.userSubRoute,
        handler: (req: IncomingMessage, res: ServerResponse, id: string) => {
            try {
                const user = userService.getUserById(id);
                if (user){
                    userService.deleteUserById(id);
                    return responseHandlerHTML(res, HttpStatusCode.OK, `User with ID: ${id} has been deleted`);
                }
            } catch (err) {
                console.error(err)
                return responseHandlerHTML(res, HttpStatusCode.BAD_REQUEST, errors.unableDeleteUser(id));
            }
        }
    },
]
