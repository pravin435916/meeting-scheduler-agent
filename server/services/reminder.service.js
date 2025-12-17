import cron from "node-cron";
import Meeting from "../models/Meeting.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 30 * 60000);

  const meetings = await Meeting.find({
    startTime: { $gte: now, $lte: upcoming },
    status: "scheduled"
  }).populate("employee manager");

  meetings.forEach(m => {
    console.log(`
🔔 Reminder
Employee: ${m.employee.name}
Manager: ${m.manager.name}
Starts at: ${m.startTime}
    `);
  });
});
