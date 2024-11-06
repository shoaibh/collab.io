import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "clear guest users",
  {
    hourUTC: 18,
    minuteUTC: 30,
  },
  internal.deleteGuestUsers.deleteGuestUsers,
);

crons.daily(
  "clear notifications",
  {
    hourUTC: 18,
    minuteUTC: 30,
  },
  internal.deleteNotifications.deleteNotifications,
);

export default crons;
