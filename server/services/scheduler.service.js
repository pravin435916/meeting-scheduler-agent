import Meeting from "../models/Meeting.js";

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;
const SLOT_DURATION_MIN = 30;

// Check for scheduling conflicts
export const hasConflict = async (employeeId, managerId, start, end) => {
  return await Meeting.exists({
    $or: [
      { employee: employeeId },
      { manager: managerId }
    ],
    startTime: { $lt: end },
    endTime: { $gt: start },
    status: "scheduled"
  });
};
//  Generate next available slots
export const findAvailableSlots = async (employeeId, managerId) => {
  const slots = [];
  const base = new Date();

  base.setMinutes(0, 0, 0);

  for (let day = 0; day < 2; day++) {
    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
      for (let min of [0, 30]) {
        const start = new Date(base);
        start.setDate(start.getDate() + day);
        start.setHours(hour, min, 0, 0);

        const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60000);

        const conflict = await hasConflict(employeeId, managerId, start, end);
        if (!conflict) {
          slots.push({ start, end });
        }

        if (slots.length === 3) return slots;
      }
    }
  }
  return slots;
};

// Auto-schedule first free slot
export const autoSchedule = async (employee, manager) => {
  const slots = await findAvailableSlots(employee, manager);
  if (!slots.length) return null;

  return Meeting.create({
    employee,
    manager,
    startTime: slots[0].start,
    endTime: slots[0].end,
    autoRescheduled: true
  });
};
