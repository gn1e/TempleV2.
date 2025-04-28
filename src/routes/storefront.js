import app from "..";
import path from "path";
import fs from "fs";

export default function () {
  app.get("/fortnite/api/storefront/v2/keychain", async (c) => {
    const keychain = await JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../responses/Storefront/keychain.json"),
        "utf-8"
      )
    );
    return c.json(keychain);
  });
  app.get("/fortnite/api/storefront/v2/catalog", async (c) => {
    const catalog = JSON.parse(
      fs
        .readFileSync(
          path.join(__dirname, "../../responses/Storefront/catalog.json")
        )
        .toString()
    );

    return c.json(catalog);
  });
}
