import { Hono } from "hono";
import Logger from "./utils/logger";
import RouteLoader from "./utils/routeloader";
import path from "path";

var app = new Hono();
var routeLoader = new RouteLoader(app);

const handleData = (c) => {
  if (c.req.headers.get("Content-Type") === "application/json") {
    return c.req.json();
  }

  if (
    c.req.headers.get("Content-Type") === "application/x-www-form-urlencoded"
  ) {
    return c.req.parseForm();
  }
  return c.text("Unsupported Content-Type", 415);
};

export default app;

app.use(async (c, next) => {
  Logger.backend(`${c.req.path} | ${c.req.method}`);
  await next();
});

Bun.serve({
  fetch: app.fetch,
  port: 3551,
});

Logger.backend(`TempleV2 running on port 3551`);

// it didn't work so I made it work
await routeLoader.loadRoutes(path.join(__dirname, "routes"), app);
await routeLoader.loadRoutes(path.join(__dirname, "operations"), app);
await import("./database/database");
