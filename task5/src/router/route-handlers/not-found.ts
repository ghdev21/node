import {ServerResponse} from "http";
import {HttpStatusCode} from "../constants";
import {baseHeaders} from "../Router";

export const showNotFoundView = (res: ServerResponse, message = 'Page is not found') => {
    res.writeHead(HttpStatusCode.NOT_FOUND, {
        "Content-Type": "text/html"
    });
    res.end(`<h1>${message}</h1>`)
};
