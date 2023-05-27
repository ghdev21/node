import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import {BASE_URL, HttpStatusCode} from "./constants";
import {showNotFoundView} from "./route-handlers/not-found";
import {userService} from "../services/user.service";
import {IUser} from "../types/UserTypes";
import {getRequestBody, validateUserFields} from "../utils/utils.";


export const baseHeaders = {
    "Content-Type": "text/json"
}


const routes = [
    {
        method: 'GET',
        pattern: /^\/users$/,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
            res.writeHead(HttpStatusCode.OK, {
                "Content-Type": "text/json"
            });

            const users = userService.getAllUsers();

            return res.end(JSON.stringify(users))
        }
    },
    {
        method: 'GET',
        pattern: /^\/users\/([\w-]+)$/,
        handler: async (req: IncomingMessage, res: ServerResponse, id: string) =>  {
            if (id) {
                try {
                    const user = userService.getUserById(id);
                    res.writeHead(200, {
                        "Content-Type": "text/json"
                    });
                    res.end(JSON.stringify(user));
                } catch (err) {
                    console.error(err);
                    return showNotFoundView(res, `Unable to find the user with following id: ${id}`);
                }

            } else {
                return showNotFoundView(res, 'Missing param user id');
            }
        }
    },
    {
        method: 'POST',
        pattern: /^\/users$/,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
            try {
                const data: IUser = await getRequestBody(req);
                const invalidFields = validateUserFields(data);

                if (invalidFields.length) {
                    res.writeHead(422, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify(invalidFields));
                } else {
                    try {
                        const newUser = userService.createUser(data);
                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });
                        res.end(JSON.stringify(newUser));
                    } catch (err) {
                        console.error(err);
                        return showNotFoundView(res, 'User already exists.');
                    }
                }
            } catch (err) {
                console.error(err);
                return showNotFoundView(res, 'Cannot parse the request.');
            }
        },
    },
    {
        method: 'DELETE',
        pattern: /^\/users\/([\w-]+)$/,
        handler: (req: IncomingMessage, res: ServerResponse, id: string) => {
            if (id) {
                try {
                    userService.deleteUserById(id);
                    res.writeHead(200, {
                        "Content-Type": "text/json"
                    });
                    res.end(`User with ID: ${id} has been deleted`);
                } catch (err) {
                    console.error(err)
                    return showNotFoundView(res, 'User with ID: ${id} has not been deleted');
                }
            } else {
                return showNotFoundView(res, 'Missing param user id');
            }

        }
    },
    {
        method: 'PUT',
        pattern: /^\/users\/([\w-]+)$/,
        handler: async (req: IncomingMessage, res: ServerResponse, id: string) => {
            try {
                const data: IUser = await getRequestBody(req);
                const invalidFields = validateUserFields(data);

                if (invalidFields.length) {
                    res.writeHead(422, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify(invalidFields));
                } else {
                    try {
                        const newUser = userService.updateUser(id, data);
                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });
                        res.end(JSON.stringify(newUser));
                    } catch (err) {
                        console.error(err);
                        return showNotFoundView(res, 'User already exists.');
                    }
                }
            } catch (err) {
                console.error(err);
                return showNotFoundView(res, 'Cannot parse the request.');
            }
        }
    },

    {
        method: 'POST',
        pattern: /^\/users\/([\w-]+)\/hobbies$/,
        handler: () => console.log('hobie post')
    },
    {
        method: 'DELETE',
        pattern: /^\/users\/([\w-]+)\/hobbies\/([\w-]+)$/,
        handler: () => console.log('hobie delete user')
    },
    {
        method: 'PUT',
        pattern: /^\/users\/([\w-]+)\/hobbies\/([\w-]+)$/,
        handler: () => console.log('update hobies')
    },
    {
        method: 'GET',
        pattern: /^\/users\/([\w-]+)\/hobbies$/,
        handler: () => console.log('hobie get')
    },
];

export class Router {
    async handleRoute(req: IncomingMessage, res: ServerResponse) {
        const url = new URL(req.url!, BASE_URL);
        const {pathname} = url;
        const {method} = req;

        for (const route of routes) {
            if (method === route.method && route.pattern.test(pathname)) {
                const params = route.pattern.exec(pathname)?.slice(1);
                //@ts-ignore
                await route.handler(req, res, ...(params || []));
                return;
            }
        }

        const respond = (res: any, code: number) => console.log('failed')
        respond(res, 404)

    }
}

export const router = new Router();
