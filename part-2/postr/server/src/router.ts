type CallbackHandler = (
  request: Request,
  params: Record<string, string>
) => Promise<Response>;

export default class Router {
  #routes: Record<string, Array<any>> = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
  };
  add(method: string, pathname: string, handler: CallbackHandler) {
    this.#routes[method].push({
      pattern: new URLPattern({ pathname }),
      handler,
    });
  }
  async route(req: Request): Promise<Response> {
    for (const r of this.#routes[req.method]) {
      if (r.pattern.test(req.url)) {
        const params = r.pattern.exec(req.url).pathname.groups;
        return await r["handler"](req, params);
      }
    }
    return new Response(null, { status: 404 });
  }
}
