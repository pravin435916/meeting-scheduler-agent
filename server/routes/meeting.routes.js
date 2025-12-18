import express from "express";
import Meeting from "../models/Meeting.js";
import {
  hasConflict,
  findAvailableSlots,
  autoSchedule,
} from "../services/scheduler.service.js";

const router = express.Router();

// schedule a meeting manual or auto
router.post("/", async (req, res) => {
  const { employee, manager, startTime, endTime, mode } = req.body;

  const durationMin = (new Date(endTime) - new Date(startTime)) / 60000;

  const conflict = await hasConflict(employee, manager, startTime, endTime);

  if (conflict && mode === "auto") {
    const meeting = await autoSchedule(
      employee,
      manager,
      startTime,
      durationMin
    );

    return res.json({
      message: "Auto scheduled using gap logic",
      meeting,
    });
  }

  if (conflict) {
    const suggestions = await findAvailableSlots(
      employee,
      manager,
      startTime,
      durationMin
    );

    return res.status(409).json({
      message: "Conflict detected",
      suggestedSlots: suggestions,
    });
  }

  const meeting = await Meeting.create({
    employee,
    manager,
    startTime,
    endTime,
    status: "scheduled",
  });

  res.status(201).json(meeting);
});

// delete a meeting
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Meeting.findByIdAndDelete(id);
  res.json({ message: "Meeting deleted" });
});

// get all meetings
router.get("/", async (_, res) => {
  const meetings = await Meeting.find().populate("employee manager");
  res.json(meetings);
});

export default router;
