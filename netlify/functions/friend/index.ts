import type { Config, Context } from "@netlify/functions";
import { handleGet } from "./friends-list";
import { handleGetById } from "./friends-get";
import { handlePost } from "./friends-add";
import { handleDelete } from "./friends-delete";
import { verifyAuth, requireAdmin, requireFriendAccess, authErrorResponse } from "../lib/auth";

export const config: Config = {
  path: ["/api/friend", "/api/friend/:id"],
};

export default async function handler(req: Request, ctx: Context) {
  const id = ctx.params?.id;

  try {
    switch (req.method) {
      case "GET":
        if (id) {
          requireFriendAccess(req, id);
          return handleGetById(id);
        }
        const user = verifyAuth(req);
        if (user.friend_id !== null) throw { status: 403, message: "Access denied" };
        return handleGet();
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
