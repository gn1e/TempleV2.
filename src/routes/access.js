import app from "..";
import contentpages from "../../responses/contentpages.json";
import discovery from "../../responses/Discovery/frontend.json";

export default function () {
  app.get("/content/api/pages/*", async (c) => {
    return c.json(contentpages);
  });

  app.get("/lightswitch/api/service/Fortnite/status", async (c) => {
    return c.json({
      serviceInstanceId: "fortnite",
      status: "UP",
      message: "Fortnite is online",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: [],
      banned: false,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    });
  });

  app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", async (c) => {
    c.header("Content-Type", "text/plain");
    return c.text(true);
  });

  app.get("/waitingroom/api/waitingroom", (c) => {
    return c.json([], 204);
  });

  app.get("/fortnite/api/game/v2/enabled_features", async (c) => {
    return c.json([]);
  });

  app.post("/fortnite/api/game/v2/grant_access/*", async (c) => {
    c.status(204);
    return c.json({});
  });

  app.get("/lightswitch/api/service/bulk/status", async (c) => {
    return c.json([
      {
        serviceInstanceId: "fortnite",
        status: "UP",
        message: "fortnite is up.",
        maintenanceUri: null,
        overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
        allowedActions: ["PLAY", "DOWNLOAD"],
        banned: false,
        launcherInfoDTO: {
          appName: "Fortnite",
          catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
          namespace: "fn",
        },
      },
    ]);
  });

  app.post("/api/v2/discovery/surface/", async (c) => {
    return c.json(discovery.v2);
  });

  app.post("/discovery/surface/", async (c) => {
    return c.json(discovery.v1);
  });

  app.get("/fortnite/api/discovery/accessToken/:branch", async (c) => {
    return c.json({
      branchName: c.req.params.branch,
      appId: "Fortnite",
      token: "reallysecuretoken",
    });
  });

  app.post("/links/api/fn/mnemonic", async (c) => {
    const MnemonicArray = discovery.v2.Panels[1].Pages[0].results.map(
      (result) => result.linkData
    );
    return c.json(MnemonicArray);
  });

  app.get("/links/api/fn/mnemonic/:playlist/related", async (c) => {
    const response = {
      parentLinks: [],
      links: {},
    };

    if (c.req.params.playlist) {
      discovery.v2.Panels[1].Pages[0].results.forEach((result) => {
        const linkData = result.linkData;
        if (linkData.mnemonic === c.req.params.playlist) {
          response.links[c.req.params.playlist] = linkData;
        }
      });
    }

    return c.json(response);
  });

  app.get("/links/api/fn/mnemonic/*", async (c) => {
    const mnemonic = c.req.url.split("/").slice(-1)[0];
    const result = discovery.v2.Panels[1].Pages[0].results.find(
      (result) => result.linkData.mnemonic === mnemonic
    );
    if (result) {
      return c.json(result.linkData);
    }
    return c.json({ error: "Mnemonic not found" });
  });

  app.get("/fortnite/api/version", async (c) => {
    return c.json({
      app: "fortnite",
      serverDate: new Date().toISOString(),
      overridePropertiesVersion: "unknown",
      cln: "17951730",
      build: "444",
      moduleName: "Fortnite-Core",
      buildDate: "2021-10-27T21:00:51.697Z",
      version: "18.30",
      branch: "Release-18.30",
      modules: {
        "Epic-LightSwitch-AccessControlCore": {
          cln: "17237679",
          build: "b2130",
          buildDate: "2021-08-19T18:56:08.144Z",
          version: "1.0.0",
          branch: "trunk",
        },
        "epic-xmpp-api-v1-base": {
          cln: "5131a23c1470acbd9c94fae695ef7d899c1a41d6",
          build: "b3595",
          buildDate: "2019-07-30T09:11:06.587Z",
          version: "0.0.1",
          branch: "master",
        },
        "epic-common-core": {
          cln: "17909521",
          build: "3217",
          buildDate: "2021-10-25T18:41:12.486Z",
          version: "3.0",
          branch: "TRUNK",
        },
      },
    });
  });

  app.get("/fortnite/api/v2/versioncheck/*", async (c) => {
    return c.json({
      type: "NO_UPDATE",
    });
  });

  app.get("/fortnite/api/v2/versioncheck*", async (c) => {
    return c.json({
      type: "NO_UPDATE",
    });
  });

  app.get("/fortnite/api/versioncheck*", async (c) => {
    return c.json({
      type: "NO_UPDATE",
    });
  });
}
