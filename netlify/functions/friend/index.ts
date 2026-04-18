import type { Config, Context } from "@netlify/functions";
import { handleGet } from "./friends-list";
import { handleGetById } from "./friends-get";
import { handlePost } from "./friends-add";
import { handleDelete } from "./friends-delete";
import { verifyAuth, requireAdmin, authErrorResponse } from "../lib/auth";

export const config: Config = {
  path: ["/api/friend", "/api/friend/:id"],
};

export default async function handler(req: Request, ctx: Context) {
  const id = ctx.params?.id;

  try {
    switch (req.method) {
      case "GET":
        verifyAuth(req);
        return id ? handleGetById(id) : handleGet();
      case "POST":
        requireAdmin(req);
        return handlePost(req);
      case "DELETE":
        requireAdmin(req);
        if (!id) return new Response("Friend id is required", { status: 400 });
        return handleDelete(id);
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (err) {
    return authErrorResponse(err);
  }
}
