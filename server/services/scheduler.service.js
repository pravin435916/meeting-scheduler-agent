import Meeting from "../models/Meeting.js";

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;

// Check conflict
export const hasConflict = async (employeeId, managerId, start, end) => {
  return await Meeting.exists({
    $or: [{ employee: employeeId }, { manager: managerId }],
    startTime: { $lt: new Date(end) },
    endTime: { $gt: new Date(start) },
    status: "scheduled"
  });
};

// Find first conflicting meeting in a time range
const getConflict = async (employee, manager, start, end) => {
  return await Meeting.findOne({
    $or: [{ employee }, { manager }],
    startTime: { $lt: end },
    endTime: { $gt: start },
    status: "scheduled"
  }).sort({ startTime: 1 }); // sort to get earliest conflict
};

// GAP-BASED SLOT FINDER
// Returns next N available slots starting from requested time
export const findAvailableSlots = async (
  employee,
  manager,
  requestedStart,
  durationMin,
  limit = 3
) => {
  const slots = [];
  let current = new Date(requestedStart);

  // Align to working hours
  if (current.getHours() < WORK_START_HOUR) {
    current.setHours(WORK_START_HOUR, 0, 0, 0);
  }

  let day = 0;

  while (slots.length < limit && day < 2) {
    const endOfDay = new Date(current);
    endOfDay.setHours(WORK_END_HOUR, 0, 0, 0);

    while (true) {
      const candidateEnd = new Date(
        current.getTime() + durationMin * 60000
      );

      // Doesn't fit today
      if (candidateEnd > endOfDay) break;

      const conflict = await getConflict(
        employee,
        manager,
        current,
        candidateEnd
      );

      if (!conflict) {
        // Found gap
        slots.push({
          start: new Date(current),
          end: candidateEnd
        });

        // move forward to find next suggestion
        current = new Date(candidateEnd);
      } else {
        // jump to end of conflict
        current = new Date(conflict.endTime);
      }

      if (slots.length === limit) break;
    }

    // Move to next day
    day++;
    current.setDate(current.getDate() + 1);
    current.setHours(WORK_START_HOUR, 0, 0, 0);
  }

  return slots;
};


// Auto-schedule = first available gap
export const autoSchedule = async (
  employee,
  manager,
  requestedStart,
  durationMin
) => {
  const slots = await findAvailableSlots(
    employee,
    manager,
    requestedStart,
    durationMin,
    1 // only need first slot
  );

  if (!slots.length) return null;

  return await Meeting.create({
    employee,
    manager,
    startTime: slots[0].start,
    endTime: slots[0].end,
    autoRescheduled: true,
    status: "scheduled"
  });
};
