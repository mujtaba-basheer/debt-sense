import type { Config, Context } from "@netlify/functions";
import { handleGet } from "./friends-list";
import { handlePost } from "./friends-add";

export const config: Config = {
  path: "/api/friend",
};

export default async function handler(req: Request, _ctx: Context) {
  switch (req.method) {
    case "GET":
      return handleGet();
    case "POST":
      return handlePost(req);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
