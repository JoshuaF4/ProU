import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api", "");
  const method = req.method;

  // Route handling based on path and method
  if (path === "/health" && method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", message: "Server is running" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Add routes for /auth, /employees, /tasks, /dashboard
  // Migrate logic from backend/routes/*.js files

  return new Response(
    JSON.stringify({ error: "Route not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
};

export const config: Config = {
  path: "/api/*"
