import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../db";

interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "viewer";
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function handleLogin(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return json({ error: "Email and password are required" }, 400);
  }

  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  const user = rows[0] as DbUser | undefined;

  // Always compare to prevent timing attacks even when user not found
  const hashToCompare = user?.password_hash ?? "$2a$10$invalidhashfortimingprotection00000000000000000";
  const valid = await bcrypt.compare(password, hashToCompare);

  if (!user || !valid) {
    return json({ error: "Invalid email or password" }, 401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env var is not set");

  const token = jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  return json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
