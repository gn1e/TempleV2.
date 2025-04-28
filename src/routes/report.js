import app from "..";
import { WebhookClient } from "discord.js";
import Users from "../models/user";

export default function () {
  app.post(
    "/fortnite/api/game/v2/toxicity/account/:unsafeReporter/report/:reportedPlayer",
    async (c) => {
      const body = await c.req.json();

      const webhook = process.env.REPORTING_WEBHOOK || "";
      const accountId = c.req.param("accountId");
      const user = await Users.findOne({ id: accountId });

      if (!webhook) return c.json({});

      const client = new WebhookClient({ url: webhook });

      if (body.reason) {
        const reason = body.reason;
        let reporter = c.req.param("unsafeReporter");
        const reporterPlayerUser = await Users.findOne({ accountId: reporter });
        const reportedPlayer = c.req.param("reportedPlayer");
        const reportedPlayerUser = await Users.findOne({
          accountId: reportedPlayer,
        });
        const details = body.details;
        const playlistName = body.playlistName;

        if (reporter === accountId) {
          reporter = user?.username || "";
        }

        const embed = {
          title: "Player Report!",
          color: 0x00ff00,
          fields: [
            {
              name: "Reporter",
              value: reporterPlayerUser?.username,
            },
            {
              name: "Reported",
              value: reportedPlayerUser?.username,
            },
            {
              name: "Reason",
              value: reason,
            },
            {
              name: "Details",
              value: details,
            },
            {
              name: "Playlist Name",
              value: playlistName || "Couldn't find playlist name!",
            },
          ],
        };

        await client.send({
          embeds: [embed],
        });
      }

      return c.json({});
    }
  );
}
