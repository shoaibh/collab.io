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

export default crons;
