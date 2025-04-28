import User from "../models/user";
import app from "..";
import { v4 as uuidv4 } from "uuid";
import { sign } from "hono/jwt";

export default function () {
  app.post("/account/api/oauth/token", async (c) => {
    const body = await c.req.parseBody();
    const user = await User.findOne({ email: body.username });
    const createId = uuidv4();

    if (!user && body.grant_type !== "client_credentials") {
      return c.json({ error: "Invalid request" }, 400);
    }

    if (!body) {
      return c.json({ error: "Invalid request" }, 400);
    }

    if (user?.banned) return c.json({ error: "User is banned" }, 400);

    const created = new Date(user?.created ?? Date.now());
    const now = new Date();
    const expires_in = Math.round((now.getTime() - created.getTime()) / 1000);
    const expires_at = new Date(created.getTime() + expires_in * 1000);

    const lawinResponse = {
      access_token: "lawinstokenlol",
      refresh_token: "lawinstokenlol",
      client_id: "lawinsclientidlol",
      device_id: "lawinsdeviceidlol",
    };

    let access;

    if (body.grant_type === "client_credentials") {
      access = await sign({ createId }, "Secret");

      if (lawinResponse.access_token) {
        return c.json({ error: "Invalid request" }, 400);
      }
      if (lawinResponse.refresh_token) {
        return c.json({ error: "Invalid request" }, 400);
      }
      if (lawinResponse.client_id) {
        return c.json({ error: "Invalid request" }, 400);
      }
      if (lawinResponse.device_id) {
        return c.json({ error: "Invalid request" }, 400);
      }
      return c.json({
        access_token: access,
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
      });
    } else if (body.grant_type === "password") {
      const { password } = body;

      if (
        !user?.password ||
        !(await Bun.password.verify(password, user.password))
      )
        return c.json({ error: "Invalid request" }, 400);

      let access = await sign(
        {
          email: body.username,
          password: body.password,
          type: "access",
        },
        "Secret"
      );

      let refresh = await sign(
        {
          email: body.username,
          password: body.password,
          type: "refresh",
        },
        "Secret"
      );

      return c.json({
        access_token: access,
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        refresh_token: refresh,
        refresh_expires: 28800,
        refresh_expires_at: "9999-12-02T01:12:01.100Z",
        account_id: user?.accountId,
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
        displayName: user?.username,
        app: "fortnite",
        in_app_id: user?.accountId,
        device_id: createId,
      });
    } else if (body.grant_type === "refresh_token") {
      let access = await sign(
        {
          email: body.username,
          password: body.password,
          type: "access",
        },
        "Secret"
      );

      let refresh = await sign(
        {
          email: body.username,
          password: body.password,
          type: "refresh",
        },
        "Secret"
      );

      return c.json({
        access_token: access,
        expires_in: expires_in,
        expires_at: expires_at,
        token_type: "bearer",
        refresh_token: refresh,
        refresh_expires: 28800,
        refresh_expires_at: "9999-12-31T23:59:59.999Z",
        account_id: user?.accountId,
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
        displayName: user?.username,
        app: "fortnite",
        in_app_id: user?.accountId,
        device_id: createId,
      });
    }
  });

  app.delete("/account/api/oauth/sessions/kill", async (c) => {
    c.status(204);
    return c.json({});
  });

  app.get("/account/api/oauth/exchange", async (c) => {
    return c.json({
      expiresInSeconds: 299,
      code: uuidv4(),
      creatingClientId: uuidv4(),
    });
  });

  app.get("/account/api/oauth/verify", async (c) => {
    const createId = uuidv4();
    let token = c.req.header("authorization")?.replace("bearer ", "");

    return c.json({
      token: token,
      account_id: c.req.param("accountId"),
      client_id: createId,
      internal_client: true,
      client_service: "fortnite",
      expires_in: 28800,
      expires_at: "9999-12-02T01:12:01.100Z",
      app: "fortnite",
      auth_method: "password",
      device_id: createId,
      displayName: c.req.param("username"),
      in_app_id: c.req.param("accountId"),
    });
  });
}
