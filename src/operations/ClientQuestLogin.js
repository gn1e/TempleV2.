import app from "..";
import Profile from "../models/profile";
import { applyProfileChanges } from "../utils/ProfileManager";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin",
    async (c) => {
      try {
        const { profileId, rvn } = c.req.query();
        var profiles = await Profile.findOne({
          accountId: c.req.param("accountId"),
        });
        let profile = profiles?.profiles[profileId];
        if (!profile || !profiles) {
          return c.json({
            profileRevision: 0,
            profileId: profileId,
            profileChangesBaseRevision: 0,
            profileChanges: [],
            profileCommandRevision: 0,
            serverTime: new Date().toISOString(),
            multiUpdate: [],
            responseVersion: 1,
          });
        }

        let BaseRevision = profile.rvn;
        let MultiUpdate = [];
        let ApplyProfileChanges = [];

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        const response = await applyProfileChanges(
          profile,
          profileId,
          profiles
        );

        return c.json(response);
      } catch (error) {
        console.error(error);
      }
    }
  );
}
