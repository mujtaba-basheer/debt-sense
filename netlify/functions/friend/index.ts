import type { Config, Context } from "@netlify/functions";
import { handleGet } from "./friends-list";
import { handleGetById } from "./friends-get";
import { handlePost } from "./friends-add";
import { handleDelete } from "./friends-delete";

export const config: Config = {
  path: ["/api/friend", "/api/friend/:id"],
};

export default async function handler(req: Request, ctx: Context) {
  const id = ctx.params?.id;

  switch (req.method) {
    case "GET":
      return id ? handleGetById(id) : handleGet();
    case "POST":
      return handlePost(req);
    case "DELETE":
      if (!id) return new Response("Friend id is required", { status: 400 });
      return handleDelete(id);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
