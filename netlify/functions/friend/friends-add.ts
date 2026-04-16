import { sql } from "../db";
import { addFriendSchema } from "../../../src/logic/friend";

export async function handlePost(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = addFriendSchema.omit({ photo: true }).safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error.flatten().fieldErrors }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  const { name, relation, gender } = result.data;

  // Derive initials from name (up to 2 words)
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const rows = await sql`
    INSERT INTO friends (name, initials, relation, gender)
    VALUES (${name}, ${initials}, ${relation}, ${gender})
    RETURNING *
  `;

  return new Response(JSON.stringify({ friend: rows[0] }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
