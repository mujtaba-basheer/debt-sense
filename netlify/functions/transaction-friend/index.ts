import type { Config, Context } from "@netlify/functions";
import { handleGetByFriend } from "./transaction-list";
import { handleGetSummaryByFriend } from "./transaction-summary";
import { handleSettleAllByFriend } from "./settle-all";
import { verifyAuth, requireAdmin, authErrorResponse } from "../lib/auth";

export const config: Config = {
  path: [
    "/api/transaction/friend/:friendId",
    "/api/transaction/friend/:friendId/summary",
    "/api/transaction/friend/:friendId/settle",
  ],
};

export default async function handler(req: Request, ctx: Context) {
  try {
    const friendId = ctx.params?.friendId;
    if (!friendId) return new Response("Friend id is required", { status: 400 });

    const pathname = new URL(req.url).pathname;
    const isSummary = pathname.endsWith("/summary");
    const isSettle = pathname.endsWith("/settle");

    switch (req.method) {
      case "GET":
        verifyAuth(req);
        return isSummary
          ? handleGetSummaryByFriend(friendId)
          : handleGetByFriend(friendId);
      case "PUT":
        requireAdmin(req);
        if (isSettle) return handleSettleAllByFriend(friendId);
        return new Response("Not Found", { status: 404 });
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (err) {
    return authErrorResponse(err);
  }
}
