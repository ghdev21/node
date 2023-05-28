import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import {BASE_URL} from "./constants";

import {usersRouter} from "./UsersRouter";
import {hobbiesRouter} from "./HobbiesRouter";
import {showNotFoundView} from "./route-handlers/not-found";
export const baseHeaders = {
    "Content-Type": "application/json"
}
const routes = [...usersRouter, ...hobbiesRouter];;

export class Router {
    async handleRoute(req: IncomingMessage, res: ServerResponse) {
        const url = new URL(req.url!, BASE_URL);
        const {pathname} = url;
        const {method} = req;

        for (const route of routes) {
            if (method === route.method && route.pattern.test(pathname)) {
                const params: string[] | undefined = route.pattern.exec(pathname)?.slice(1);
                const [id] = params?.length ? params : [];
                await route.handler(req, res, id);

                return
            }
        }

      showNotFoundView(res)
    }
}

export const router = new Router();
