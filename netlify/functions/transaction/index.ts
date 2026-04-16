import type { Config, Context } from "@netlify/functions";
import { handlePost } from "./transaction-add";

export const config: Config = {
  path: "/api/transaction",
};

export default async function handler(req: Request, _ctx: Context) {
  switch (req.method) {
    case "POST":
      return handlePost(req);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
