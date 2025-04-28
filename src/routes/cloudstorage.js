import app from "..";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import User from "../models/user";

export default function () {
  app.get("/fortnite/api/cloudstorage/system", async (c) => {
    const dir = path.join(__dirname, "..", "CloudStorage");
    const CloudFiles = [];

    const files = fs.readdirSync(dir);
    files.forEach((name) => {
      if (name.toLowerCase().endsWith(".ini")) {
        const ParsedFile = fs.readFileSync(path.join(dir, name), "utf8");
        const ParsedStats = fs.statSync(path.join(dir, name));
        CloudFiles.push({
          uniqueFilename: name,
          filename: name,
          hash: crypto.createHash("sha1").update(ParsedFile).digest("hex"),
          hash256: crypto.createHash("sha256").update(ParsedFile).digest("hex"),
          length: ParsedFile.length,
          contentType: "application/octet-stream",
          uploaded: ParsedStats.mtime,
          storageType: "S3",
          storageIds: {},
          doNotCache: true,
        });
      }
    });

    return c.json(CloudFiles);
  });

  app.get("/fortnite/api/cloudstorage/system/:file", async (c) => {
    const file = path.join(
      __dirname,
      "..",
      "CloudStorage",
      c.req.param("file")
    );
    if (fs.existsSync(file)) return c.json(fs.readFileSync(file));
    return c.status(200).end();
  });

  app.get("/fortnite/api/cloudstorage/user/*/:file", async (c) => {
    return c.status(200).end();
  });

  app.get("/fortnite/api/cloudstorage/user/:accountId", async (c) => {
    return c.json([]);
  });

  app.put("/fortnite/api/cloudstorage/user/*/:file", async (c) => {
    return c.status(204).end();
  });
}
