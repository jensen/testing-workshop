import { rest } from "msw";
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

const mock = (method) => (path) => ({
  response: (data) =>
    server.use(
      rest[method](path, (request, response, context) =>
        response(context.json(data))
      )
    ),
  error: (status) =>
    server.use(
      rest[method](path, (request, response, context) =>
        response(
          context.status(status),
          context.json({ messages: ["The error message"] })
        )
      )
    ),
});

export const mockGet = mock("get");
export const mockPost = mock("post");
export const mockPut = mock("put");
export const mockDelete = mock("delete");
