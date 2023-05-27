import http, {IncomingMessage, ServerResponse} from "http";
import {router} from "./router/Router";

const PORT = 3000;

const server = http.createServer(router.handleRoute)

server.listen(PORT, () => console.log(`Server has been stared on port: ${PORT}`));
