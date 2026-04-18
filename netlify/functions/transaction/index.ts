import type { Config, Context } from "@netlify/functions";
import { handlePost } from "./transaction-add";
import { handleGetList } from "./transaction-list";
import { handleGetSummary } from "./transaction-summary";
import { handleDelete } from "./transaction-delete";
import { handleSettle } from "./transaction-settle";
import { verifyAuth, requireAdmin, authErrorResponse } from "../lib/auth";

export const config: Config = {
  path: [
    "/api/transaction",
    "/api/transaction/summary",
    "/api/transaction/:id",
    "/api/transaction/:id/settle",
  ],
};

export default async function handler(req: Request, ctx: Context) {
  const pathname = new URL(req.url).pathname;
  const isSummary = pathname.endsWith("/summary");
  const id = ctx.params?.id;

  try {
    switch (req.method) {
      case "GET":
        verifyAuth(req);
        return isSummary ? handleGetSummary() : handleGetList();
      case "POST":
        requireAdmin(req);
        return handlePost(req);
      case "DELETE":
        requireAdmin(req);
        return handleDelete(id!);
      case "PUT":
        requireAdmin(req);
        return handleSettle(id!);
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (err) {
    return authErrorResponse(err);
  }
}
