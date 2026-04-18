import type { Config } from "@netlify/functions";
import { handleLogin } from "./auth-login";

export const config: Config = {
  path: "/api/auth/login",
};

export default async function handler(req: Request) {
  switch (req.method) {
    case "POST":
      return handleLogin(req);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
