import {userService} from "../../services/user.service";
import {ServerResponse} from "http";
import {showNotFoundView} from "./not-found";
import {HTTP_METHODS, HttpStatusCode} from "../constants";

export const usersHandler = ({url, method}: {url: URL, method: HTTP_METHODS} , res: ServerResponse) => {
    const [_, resource, id, hobbyResource, hobbyId] = url.pathname.split('/');

    console.log(resource)
    try {
        if (method === HTTP_METHODS.GET) {
            res.writeHead(HttpStatusCode.OK, {
                "Content-Type": "text/json"
            });

            const users = userService.getAllUsers();

            return res.end(JSON.stringify(users))
        } else {
            return res.writeHead(200, {
                "Content-Type": "text/json"
            });
        }
    } catch (err){

    }
}
