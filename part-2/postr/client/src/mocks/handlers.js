import { rest } from "msw";

export const handlers = [
  rest.get("/api/posts", (request, response, context) =>
    response(
      context.json([
        {
          id: 1,
          title: "Post Title",
          content: "Post Content",
        },
        {
          id: 2,
          title: "Second Title",
          content: "Second Content",
        },
      ])
    )
  ),
  rest.post("/api/posts", async (request, response, context) => {
    const { body } = request;

    return response(
      context.json({
        id: 1,
        title: body.get("title"),
        content: body.get("content"),
      })
    );
  }),
  rest.put("/api/posts/:id", async (request, response, context) => {
    return response(context.json({}));
  }),
  rest.delete("/api/posts/:id", async (request, response, context) => {
    return response(context.json({}));
  }),
];
