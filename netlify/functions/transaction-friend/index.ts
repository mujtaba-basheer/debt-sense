import type { Config, Context } from "@netlify/functions";
import { handleGetByFriend } from "./transaction-list";
import { handleGetSummaryByFriend } from "./transaction-summary";

export const config: Config = {
  path: [
    "/api/transaction/friend/:friendId",
    "/api/transaction/friend/:friendId/summary",
  ],
};

export default async function handler(req: Request, ctx: Context) {
  const friendId = ctx.params?.friendId;

  if (!friendId) return new Response("Friend id is required", { status: 400 });

  const isSummary = new URL(req.url).pathname.endsWith("/summary");

  switch (req.method) {
    case "GET":
      return isSummary
        ? handleGetSummaryByFriend(friendId)
        : handleGetByFriend(friendId);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
