import jwt from "jsonwebtoken";

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
}

function extractToken(req: Request): string | null {
  const header = req.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
}

export function verifyAuth(req: Request): AuthUser {
  const token = extractToken(req);
  if (!token) throw { status: 401, message: "Authentication required" };

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env var is not set");

  try {
    return jwt.verify(token, secret) as AuthUser;
  } catch {
    throw { status: 401, message: "Invalid or expired token" };
  }
}

export function requireAdmin(req: Request): AuthUser {
  const user = verifyAuth(req);
  if (user.role !== "admin") {
    throw { status: 403, message: "Admin access required" };
  }
  return user;
}

export function authErrorResponse(err: unknown): Response {
  const e = err as { status?: number; message?: string };
  return new Response(
    JSON.stringify({ error: e.message ?? "Unauthorized" }),
    { status: e.status ?? 500, headers: { "Content-Type": "application/json" } }
  );
}
