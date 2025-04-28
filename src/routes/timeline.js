import app from "..";

export default function () {
  app.get("/fortnite/api/calendar/v1/timeline", async (c) => {
    const today = new Date();
    today.setHours(17, 0, 0, 0);
    const mainDate = today.toISOString();

    const ver = process.env.SEASON;

    return c.json({
      channels: {
        "client-matchmaking": {
          states: [],
          cacheExpire: "9999-01-01T22:28:47.830Z",
        },
        "client-events": {
          states: [
            {
              validFrom: "2020-01-01T00:00:00.000Z",
              activeEvents: [
                {
                  eventType: `EventFlag.Season${ver}`,
                  activeUntil: "9999-01-01T00:00:00.000Z",
                  activeSince: "2020-01-01T00:00:00.000Z",
                },
                {
                  eventType: `EventFlag.LobbySeason${ver}`,
                  activeUntil: "9999-01-01T00:00:00.000Z",
                  activeSince: "2020-01-01T00:00:00.000Z",
                },
              ],
              state: {
                activeStorefronts: [],
                eventNamedWeights: {},
                seasonNumber: ver,
                seasonTemplateId: `AthenaSeason:athenaseason${ver}`,
                matchXpBonusPoints: 0,
                seasonBegin: "2020-01-01T13:00:00Z",
                seasonEnd: "9999-01-01T14:00:00Z",
                seasonDisplayedEnd: "9999-01-01T07:30:00Z",
                weeklyStoreEnd: mainDate,
                stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                sectionStoreEnds: {
                  Featured: mainDate,
                },
                dailyStoreEnd: mainDate,
              },
            },
          ],
          cacheExpire: "9999-01-01T22:28:47.830Z",
        },
      },
      eventsTimeOffsetHrs: 0,
      cacheIntervalMins: 10,
      currentTime: "2024-09-28T05:36:47.664Z",
    });
  });
}
