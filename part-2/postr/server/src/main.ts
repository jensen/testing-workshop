import { serve } from "https://deno.land/std@0.139.0/http/server.ts";
import { DB as sqlite } from "https://deno.land/x/sqlite/mod.ts";
import * as path from "https://deno.land/std@0.139.0/path/mod.ts";

import Router from "./router.ts";

const db = new sqlite(
  path.resolve(new URL(".", import.meta.url).pathname, "..", "posts.db")
);

db.query(`
  create table if not exists posts (
    id integer primary key autoincrement,
    title text,
    content text
  )
`);

const port = 3001;

const getPosts = async (
  request: Request,
  params: Record<string, string>
): Promise<Response> => {
  const result = db.query(`select id, title, content from posts`);

  return new Response(
    JSON.stringify(
      result.map(([id, title, content]) => ({
        id,
        title,
        content,
      }))
    ),
    { status: 200 }
  );
};

const getPost = async (
  request: Request,
  params: Record<string, string>
): Promise<Response> => {
  const [[id, title, content]] = db.query(
    `select id, title, content from posts where id = $1`,
    [params.id]
  );

  return new Response(
    JSON.stringify({
      id,
      title,
      content,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const createPost = async (
  request: Request,
  params: Record<string, string>
): Promise<Response> => {
  const form = await request.formData();
  const body = Object.fromEntries(form);
  const errors = [];

  if (body.title === "") {
    errors.push("Must provide title");
  }

  if (body.content === "") {
    errors.push("Must provide content");
  }

  if (errors.length > 0) {
    return new Response(JSON.stringify({ messages: errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [[id, title, content]] = db.query(
    `insert into posts (title, content) values ($1, $2) returning id, title, content`,
    [body.title as string, body.content as string]
  );

  return new Response(JSON.stringify({ id, title, content }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

const updatePost = async (
  request: Request,
  params: Record<string, string>
): Promise<Response> => {
  const form = await request.formData();

  const body = Object.fromEntries(form);
  const errors = [];

  if (body.title === "") {
    errors.push("Must provide title");
  }

  if (body.content === "") {
    errors.push("Must provide content");
  }

  if (errors.length > 0) {
    return new Response(JSON.stringify({ messages: errors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  db.query(`update posts set title = $1, content = $2 where id = $3`, [
    form.get("title") as string,
    form.get("content") as string,
    params.id,
  ]);

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const destroyPost = async (
  request: Request,
  params: Record<string, string>
): Promise<Response> => {
  db.query(`delete from posts where id = $1`, [params.id]);

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const router = new Router();

router.add("GET", "/api/posts", getPosts);
router.add("GET", "/api/posts/:id", getPost);
router.add("POST", "/api/posts", createPost);
router.add("PUT", "/api/posts/:id", updatePost);
router.add("DELETE", "/api/posts/:id", destroyPost);

const handler = async (request: Request): Promise<Response> => {
  return await router.route(request);
};

await serve(handler, { port });
