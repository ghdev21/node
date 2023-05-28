import {IncomingMessage, ServerResponse} from "http";
import {userService} from "../services/user.service";
import {responseHandlerHTML, responseHandlerJSON, showNotFoundView} from "./route-handlers/not-found";
import {getRequestBody, IHobbiesResponse, validateHobbies} from "../utils/utils.";
import {errors, HTTP_METHODS, HttpStatusCode, parserPatterns} from "./constants";


const hobbiesSetResolver = async (req: IncomingMessage, res: ServerResponse, id: string) => {
    try {
        const {hobbies}: IHobbiesResponse = await getRequestBody(req);
        const invalidFields = validateHobbies({hobbies});

        if (!invalidFields.length) {
            const updatedHobbies = userService.createUserHobby(id, hobbies)
            return responseHandlerJSON(res, HttpStatusCode.CREATED, updatedHobbies)
        } else {
            return responseHandlerJSON(res, HttpStatusCode.CREATED, invalidFields)
        }
    } catch (err) {
        console.error(err);
        return showNotFoundView(res, errors.unableAddHobby(id));
    }
}

export const hobbiesRouter = [
    {
        method: HTTP_METHODS.GET,
        pattern: parserPatterns.userHobbies,
        handler: async (req: IncomingMessage, res: ServerResponse, id: string) => {
            try {
                const user = userService.getUserById(id);
                if (user?.hobbies?.length){
                    // cashing for the hobbies
                    res.setHeader('Cache-Control', 'public, max-age=3600');
                    res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());

                    return responseHandlerJSON(res, HttpStatusCode.OK, user.hobbies)
                } else {
                    return responseHandlerJSON(res, HttpStatusCode.NO_CONTENT, [])
                }
            } catch (err) {
                console.error(err);
                return showNotFoundView(res, errors.unableGetHobby(id));
            }
        }
    },

    {
        method: HTTP_METHODS.POST,
        pattern: parserPatterns.userHobbies,
        handler: hobbiesSetResolver,
    },
    {
        method: HTTP_METHODS.PUT,
        pattern: parserPatterns.userHobbies,
        handler: hobbiesSetResolver, // does pretty the same as for POST
    },
    {
        method: HTTP_METHODS.DELETE,
        pattern: parserPatterns.userHobbies,
        handler: (req: IncomingMessage, res: ServerResponse, id: string) => {
            try {
                const user = userService.getUserById(id);
                if (user){
                    userService.deleteUserHobby(id);
                    return responseHandlerHTML(res, HttpStatusCode.OK, `Hobbies for the user with ID: ${id} have been deleted`);
                }
            } catch (err) {
                return responseHandlerHTML(res, HttpStatusCode.BAD_REQUEST, errors.unableDeleteHobby(id));
            }
        },
    },

]
